(() => {
  const LOCAL_STORE_KEY = 'mapc-study-profile-v1';
  const MIGRATION_FLAG = 'mapc-local-progress-migrated-v1';
  let currentUser = null;
  let currentProfile = null;
  let ready = false;
  let modalEl = null;
  const listeners = [];

  const notify = () => listeners.forEach(cb => cb(currentUser));

  async function migrateLocalProgress(userId) {
    if (localStorage.getItem(MIGRATION_FLAG)) return;
    localStorage.setItem(MIGRATION_FLAG, '1');
    try {
      const raw = JSON.parse(localStorage.getItem(LOCAL_STORE_KEY) || '{}');
      const items = raw.items || {};
      const rows = Object.entries(items).map(([key, item]) => {
        const match = key.match(/^(m\d{3})-(.+)$/);
        if (!match) return null;
        return { user_id: userId, course: match[1], item_key: `pyq-${match[2]}`, status: item.status || 'not-started', note: item.note || '' };
      }).filter(Boolean);
      if (rows.length) await window.sb.from('progress').upsert(rows, { onConflict: 'user_id,course,item_key' });
    } catch {}
  }

  async function refreshProfile() {
    if (!currentUser) { currentProfile = null; return; }
    const { data } = await window.sb.from('profiles').select('full_name').eq('id', currentUser.id).maybeSingle();
    currentProfile = data || null;
  }

  function formHTML(mode) {
    const isSignup = mode === 'signup';
    return `<form data-auth-form novalidate>
      <p class="auth-kicker">Your study profile</p>
      <h2>${isSignup ? 'Make this study desk yours.' : 'Welcome back.'}</h2>
      <p class="auth-copy">${isSignup ? 'Create an account to track revision status and notes across every device.' : 'Log in to pick up your revision exactly where you left off.'}</p>
      ${isSignup ? '<label>Name<input required name="name" autocomplete="name"></label>' : ''}
      <label>Email<input required name="email" type="email" autocomplete="email"></label>
      <label>Password<input required name="password" type="password" minlength="6" autocomplete="${isSignup ? 'new-password' : 'current-password'}"></label>
      <p class="auth-message" data-auth-message aria-live="polite"></p>
      <button type="submit">${isSignup ? 'Create my account' : 'Log in'}</button>
      <p class="auth-switch">${isSignup ? 'Already have an account? ' : 'New here? '}<button type="button" class="text-button" data-auth-switch>${isSignup ? 'Log in' : 'Create an account'}</button></p>
    </form>`;
  }

  function mountForm(container) {
    let mode = 'signup';
    const render = () => {
      container.innerHTML = formHTML(mode);
      const form = container.querySelector('[data-auth-form]');
      const msg = container.querySelector('[data-auth-message]');
      container.querySelector('[data-auth-switch]').addEventListener('click', () => { mode = mode === 'signup' ? 'login' : 'signup'; render(); });
      form.addEventListener('submit', async event => {
        event.preventDefault();
        const button = form.querySelector('button[type="submit"]');
        button.disabled = true;
        msg.textContent = '';
        delete msg.dataset.type;
        const values = new FormData(form);
        const email = String(values.get('email')).trim();
        const password = String(values.get('password'));
        try {
          if (mode === 'signup') {
            const name = String(values.get('name')).trim();
            const { error } = await window.sb.auth.signUp({ email, password, options: { data: { full_name: name } } });
            if (error) throw error;
            msg.textContent = 'Check your email to confirm your account, then log in.';
            msg.dataset.type = 'success';
          } else {
            const { error } = await window.sb.auth.signInWithPassword({ email, password });
            if (error) throw error;
          }
        } catch (err) {
          msg.textContent = err.message || 'Something went wrong.';
          msg.dataset.type = 'error';
        } finally {
          button.disabled = false;
        }
      });
    };
    render();
  }

  function renderSignedIn(container) {
    const label = currentProfile?.full_name || currentUser.email;
    container.innerHTML = `<div class="profile-identity"><span class="profile-mark" aria-hidden="true">${label[0].toUpperCase()}</span><p><strong>${currentProfile?.full_name || 'Student'}</strong><small>${currentUser.email}</small></p></div><button type="button" data-auth-signout>Log out</button>`;
    container.querySelector('[data-auth-signout]').addEventListener('click', async () => {
      if (!window.confirm('Log out of your study profile?')) return;
      await window.sb.auth.signOut();
    });
  }

  function bindHomepageMarkup() {
    const shell = document.querySelector('#auth-shell');
    const bar = document.querySelector('#app-profile-bar');
    if (!shell && !bar) return;
    const render = () => {
      if (currentUser) {
        if (shell) shell.hidden = true;
        if (bar) { bar.hidden = false; renderSignedIn(bar); }
      } else {
        if (bar) bar.hidden = true;
        if (shell) { shell.hidden = false; mountForm(shell); }
      }
    };
    listeners.push(render);
    render();
  }

  function injectModalStyle() {
    if (document.querySelector('#mapc-auth-modal-style')) return;
    const style = document.createElement('style');
    style.id = 'mapc-auth-modal-style';
    style.textContent = `.mapc-auth-modal{position:fixed;inset:0;z-index:9999;background:#0b1322e8;display:grid;place-items:center;padding:20px}.mapc-auth-modal .auth-shell{background:#1c2d4a;border:1px solid rgba(248,242,232,.16);border-radius:14px;max-width:430px;padding:28px;width:100%;color:#f8f2e8;font-family:ui-sans-serif,system-ui,sans-serif}.mapc-auth-modal .auth-kicker{color:#f5be55;font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase}.mapc-auth-modal h2{font-family:Georgia,serif;font-size:1.7rem;line-height:1;margin:12px 0}.mapc-auth-modal .auth-copy{color:#b9c5d4;line-height:1.55;margin:0 0 16px}.mapc-auth-modal label{display:block;font-size:.82rem;font-weight:700;margin-top:14px}.mapc-auth-modal input{background:#0f1a2d;border:1px solid #61738d;border-radius:7px;color:#f8f2e8;display:block;font:inherit;margin-top:6px;padding:11px;width:100%}.mapc-auth-modal button:not(.text-button){background:#f5be55;border:0;border-radius:7px;color:#101827;cursor:pointer;font:700 .92rem inherit;margin-top:18px;padding:11px 14px;width:100%}.mapc-auth-modal button[disabled]{cursor:wait;opacity:.65}.mapc-auth-modal .text-button{background:transparent;border:0;color:#f5be55;cursor:pointer;font:inherit;padding:0;text-decoration:underline}.mapc-auth-modal .auth-switch{color:#b9c5d4;font-size:.88rem;margin:18px 0 0}.mapc-auth-modal .auth-message{font-size:.88rem;margin:13px 0 0;min-height:1.2em}.mapc-auth-modal .auth-message[data-type="error"]{color:#fecaca}.mapc-auth-modal .auth-message[data-type="success"]{color:#bbf7d0}`;
    document.head.append(style);
  }

  function showModalGate() {
    if (modalEl) return;
    injectModalStyle();
    modalEl = document.createElement('div');
    modalEl.className = 'mapc-auth-modal';
    modalEl.innerHTML = '<div class="auth-shell"></div>';
    document.body.append(modalEl);
    mountForm(modalEl.querySelector('.auth-shell'));
  }

  function hideModalGate() {
    if (!modalEl) return;
    modalEl.remove();
    modalEl = null;
  }

  async function bootstrap() {
    const { data: { session } } = await window.sb.auth.getSession();
    currentUser = session?.user || null;
    await refreshProfile();
    ready = true;
    if (currentUser) migrateLocalProgress(currentUser.id);
    notify();
    window.sb.auth.onAuthStateChange(async (_event, session) => {
      currentUser = session?.user || null;
      await refreshProfile();
      if (currentUser) migrateLocalProgress(currentUser.id);
      notify();
    });
  }

  window.MapcAuth = {
    getUser: () => currentUser,
    getProfile: () => currentProfile,
    onChange: cb => listeners.push(cb),
    signOut: () => window.sb.auth.signOut(),
    requireUser(onReady) {
      let fired = false;
      const attempt = () => {
        if (fired) return;
        if (currentUser) { fired = true; hideModalGate(); onReady(currentUser); }
        else if (ready) showModalGate();
      };
      listeners.push(attempt);
      attempt();
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { bindHomepageMarkup(); bootstrap(); });
  else { bindHomepageMarkup(); bootstrap(); }
})();
