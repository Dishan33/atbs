(() => {
  const STORE = 'mapc-study-profile-v1';
  const load = () => { try { return JSON.parse(localStorage.getItem(STORE) || '{}'); } catch { return {}; } };
  const save = data => localStorage.setItem(STORE, JSON.stringify(data));

  const progressFor = (data, prefix, total) => {
    const entries = Object.entries(data.items || {}).filter(([key]) => key.startsWith(`${prefix}-`)).map(([, item]) => item);
    const active = entries.filter(item => item.status !== 'ignored');
    const ignored = entries.filter(item => item.status === 'ignored').length;
    const done = active.filter(item => item.status === 'done').length;
    const target = Math.max(total - ignored, 0);
    return { done, total: target, percent: target ? Math.round(done / target * 100) : 0 };
  };

  const renderProgress = (element, progress) => {
    const summary = progress.total ? `${progress.done}/${progress.total} complete on this device` : 'No active topics on this device';
    element.innerHTML = `<span>${summary}</span><i aria-hidden="true"><b style="width:${progress.percent}%"></b></i>`;
  };

  function mount() {
    const app = document.querySelector('[data-app-profile]');
    if (!app) return;
    const modal = app.querySelector('#auth-shell');
    const profileBar = app.querySelector('#app-profile-bar');
    const render = () => {
      const data = load();
      if (!data.name || !data.email) { modal.hidden = false; profileBar.hidden = true; return; }
      modal.hidden = true;
      profileBar.hidden = false;
      app.querySelector('[data-profile-name]').textContent = data.name;
      app.querySelector('[data-profile-email]').textContent = `${data.email} · saved on this device`;
      renderProgress(app.querySelector('[data-progress="m005"]'), progressFor(data, 'm005', 21));
      renderProgress(app.querySelector('[data-progress="m006"]'), progressFor(data, 'm006', 17));
    };
    modal.innerHTML = `<form><p class="auth-kicker">Your study profile</p><h2>Make this study desk yours.</h2><p class="auth-copy">Create a private profile on this device to track revision as you move through the courses.</p><label>Name<input required name="name" autocomplete="name"></label><label>Email<input required name="email" type="email" autocomplete="email"></label><p class="auth-message" data-auth-message aria-live="polite"></p><button>Open my study library</button><p class="auth-switch">Your profile, notes and progress stay only in this browser.</p></form>`;
    modal.querySelector('form').addEventListener('submit', event => {
      event.preventDefault();
      const values = new FormData(event.currentTarget), current = load();
      save({ ...current, name: String(values.get('name')).trim(), email: String(values.get('email')).trim(), items: current.items || {} });
      render();
    });
    app.querySelector('[data-profile-signout]').addEventListener('click', () => {
      if (!window.confirm('Remove this local profile and its saved revision progress from this device?')) return;
      localStorage.removeItem(STORE);
      render();
    });
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
