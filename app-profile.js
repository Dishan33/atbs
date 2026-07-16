(() => {
  const settings = window.STUDY_SUPABASE || {};
  const key = settings.publishableKey || settings.anonKey;
  const client = settings.url && key && window.supabase?.createClient
    ? window.supabase.createClient(settings.url, key)
    : null;
  const statusLabels = { 'not-started': 'Not started', 'in-progress': 'In progress', done: 'Done', revise: 'Need to revise', ignored: 'Ignoring' };

  window.MAPCProfile = { client, statusLabels };

  const escape = value => String(value || '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const formMessage = (form, text, type = 'error') => {
    const target = form.querySelector('[data-auth-message]');
    target.textContent = text;
    target.dataset.type = type;
  };

  async function ensureProfile(user) {
    const { data: existing } = await client.from('study_profiles').select('name').eq('id', user.id).maybeSingle();
    const name = user.user_metadata?.name || existing?.name || 'Student';
    await client.from('study_profiles').upsert({ id: user.id, name, email: user.email || '', updated_at: new Date().toISOString() });
    return name;
  }

  async function courseProgress(userId, prefix, total) {
    const { data, error } = await client.from('study_progress').select('status').eq('user_id', userId).like('item_key', `${prefix}-%`);
    if (error) return null;
    const entries = data || [];
    const active = entries.filter(item => item.status !== 'ignored');
    const done = active.filter(item => item.status === 'done').length;
    const denominator = Math.max(total - entries.filter(item => item.status === 'ignored').length, 0);
    return { done, total: denominator || total, percent: denominator ? Math.round(done / denominator * 100) : 100 };
  }

  function renderProgress(element, progress) {
    if (!progress) return;
    element.innerHTML = `<span>${progress.done}/${progress.total} complete</span><i aria-hidden="true"><b style="width:${progress.percent}%"></b></i>`;
  }

  function authMarkup(mode) {
    const forms = {
      login: `<form data-auth-form="login"><p class="auth-kicker">Your study profile</p><h2>Welcome back.</h2><p class="auth-copy">Sign in to continue your revision across every device.</p><label>Email<input required name="email" type="email" autocomplete="email"></label><label>Password<input required name="password" type="password" autocomplete="current-password"></label><p class="auth-message" data-auth-message aria-live="polite"></p><button>Sign in</button><p class="auth-switch">New to the study library? <button type="button" class="text-button" data-auth-mode="create">Create a profile</button></p><button type="button" class="text-button" data-auth-mode="recover">Set or reset password</button></form>`,
      create: `<form data-auth-form="create"><p class="auth-kicker">Create your profile</p><h2>Make your study desk yours.</h2><p class="auth-copy">Your name, course progress and revision notes will follow you between devices.</p><label>Name<input required name="name" autocomplete="name"></label><label>Email<input required name="email" type="email" autocomplete="email"></label><label>Password<input required minlength="8" name="password" type="password" autocomplete="new-password"><small>At least 8 characters.</small></label><p class="auth-message" data-auth-message aria-live="polite"></p><button>Create profile</button><p class="auth-switch">Already have an account? <button type="button" class="text-button" data-auth-mode="login">Sign in</button></p></form>`,
      recover: `<form data-auth-form="recover"><p class="auth-kicker">Password setup</p><h2>Set a password.</h2><p class="auth-copy">Use this once if you originally joined through a magic link, or whenever you need to reset your password.</p><label>Email<input required name="email" type="email" autocomplete="email"></label><p class="auth-message" data-auth-message aria-live="polite"></p><button>Send password setup link</button><p class="auth-switch"><button type="button" class="text-button" data-auth-mode="login">Back to sign in</button></p></form>`,
      reset: `<form data-auth-form="reset"><p class="auth-kicker">Choose a password</p><h2>Your profile is verified.</h2><p class="auth-copy">Set a password now; future visits will only need your email and password.</p><label>New password<input required minlength="8" name="password" type="password" autocomplete="new-password"></label><p class="auth-message" data-auth-message aria-live="polite"></p><button>Save password</button></form>`
    };
    return forms[mode] || forms.login;
  }

  function attachAuth(shell, initialMode = 'login') {
    const swap = mode => { shell.innerHTML = authMarkup(mode); bind(mode); };
    const bind = mode => {
      const form = shell.querySelector('form');
      shell.querySelectorAll('[data-auth-mode]').forEach(button => button.addEventListener('click', () => swap(button.dataset.authMode)));
      form.addEventListener('submit', async event => {
        event.preventDefault();
        const data = new FormData(form), submit = form.querySelector('button[type="submit"], button:not([type])');
        submit.disabled = true;
        formMessage(form, 'Please wait…', 'info');
        let error;
        if (mode === 'login') ({ error } = await client.auth.signInWithPassword({ email: String(data.get('email')).trim(), password: String(data.get('password')) }));
        if (mode === 'create') ({ error } = await client.auth.signUp({ email: String(data.get('email')).trim(), password: String(data.get('password')), options: { data: { name: String(data.get('name')).trim() }, emailRedirectTo: `${window.location.origin}/` } }));
        if (mode === 'recover') ({ error } = await client.auth.resetPasswordForEmail(String(data.get('email')).trim(), { redirectTo: `${window.location.origin}/?auth=reset` }));
        if (mode === 'reset') ({ error } = await client.auth.updateUser({ password: String(data.get('password')) }));
        if (error) { formMessage(form, error.message); submit.disabled = false; return; }
        if (mode === 'create') formMessage(form, 'Check your email to verify your account, then sign in with this password.', 'success');
        else if (mode === 'recover') formMessage(form, 'Check your email for the password setup link.', 'success');
        else if (mode === 'reset') { window.history.replaceState({}, '', window.location.pathname); await refresh(); }
        else await refresh();
        submit.disabled = false;
      });
    };
    swap(initialMode);
  }

  async function refresh() {
    const app = document.querySelector('[data-app-profile]');
    if (!app || !client) return;
    const { data: { session } } = await client.auth.getSession();
    const modal = app.querySelector('#auth-shell');
    const profile = app.querySelector('#app-profile-bar');
    if (!session || new URLSearchParams(window.location.search).get('auth') === 'reset') { modal.hidden = false; profile.hidden = true; return; }
    modal.hidden = true;
    profile.hidden = false;
    const name = await ensureProfile(session.user);
    app.querySelector('[data-profile-name]').textContent = name;
    app.querySelector('[data-profile-email]').textContent = session.user.email || '';
    const [m005, m006] = await Promise.all([courseProgress(session.user.id, 'm005', 21), courseProgress(session.user.id, 'm006', 17)]);
    renderProgress(app.querySelector('[data-progress="m005"]'), m005);
    renderProgress(app.querySelector('[data-progress="m006"]'), m006);
  }

  function mount() {
    const app = document.querySelector('[data-app-profile]');
    if (!app) return;
    if (!client) { app.querySelector('#auth-shell').innerHTML = '<form><h2>Profile service unavailable</h2><p class="auth-copy">Please refresh and try again.</p></form>'; return; }
    const mode = new URLSearchParams(window.location.search).get('auth') || 'login';
    attachAuth(app.querySelector('#auth-shell'), mode);
    app.querySelector('[data-profile-signout]').addEventListener('click', async () => { await client.auth.signOut(); await refresh(); });
    refresh();
    client.auth.onAuthStateChange((event) => { if (event === 'PASSWORD_RECOVERY') { app.querySelector('#auth-shell').hidden = false; attachAuth(app.querySelector('#auth-shell'), 'reset'); } });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
