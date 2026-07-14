(() => {
  const courses = [
    { code: 'MPC-001', name: 'Cognitive Psychology', path: 'MPC%20001%20-%20Cognitive%20Psychology/MPC001_Dashboard.html' },
    { code: 'MPC-002', name: 'Life Span Psychology', path: 'MPC%20002%20-%20Life%20Span%20Psychology/MPC002_Dashboard.html' },
    { code: 'MPC-003', name: 'Assessment of Personality', path: 'MPC%20003%20-%20Personality/MPC003_Dashboard.html' },
    { code: 'MPC-004', name: 'Advanced Social Psychology', path: 'MPC%20004%20-%20Social%20Psychology/MPC004_Dashboard.html' },
    { code: 'MPC-005', name: 'Research Methods in Psychology', path: 'MPC%20005%20-%20Research%20Methods/MPC005_Dashboard.html' },
    { code: 'MPC-006', name: 'Statistics in Psychology', path: 'MPC%20006%20-%20Statistics%20in%20Psychology/MPC006_Dashboard.html' }
  ];

  const bar = document.querySelector('.topbar, .top');
  if (!bar || document.querySelector('.course-jump')) return;

  const current = courses.find((course) => decodeURIComponent(location.pathname).includes(decodeURIComponent(course.path.split('/')[0]))) || courses[0];
  const style = document.createElement('style');
  style.textContent = `
    .course-jump,.study-jump{flex:0 0 auto;position:relative;z-index:20}.course-jump summary,.study-jump summary{align-items:center;background:#0f172a;border:1px solid rgba(246,242,233,.2);border-radius:8px;color:#f6f2e9;cursor:pointer;display:flex;font:700 .69rem Inter,system-ui,sans-serif;gap:7px;letter-spacing:.03em;list-style:none;min-height:38px;padding:8px 10px;white-space:nowrap}.course-jump summary::-webkit-details-marker,.study-jump summary::-webkit-details-marker{display:none}.course-jump summary:focus-visible,.study-jump summary:focus-visible,.course-menu a:focus-visible,.study-menu button:focus-visible{outline:2px solid #f6b84b;outline-offset:2px}.course-jump-label,.study-jump-label{color:#aab7c8;font-weight:500}.course-chevron,.study-chevron{color:#f6b84b;font-size:.8rem;transition:transform .16s ease}.course-jump[open] .course-chevron,.study-jump[open] .study-chevron{transform:rotate(180deg)}.course-menu,.study-menu{background:#17233a;border:1px solid rgba(246,242,233,.2);border-radius:10px;box-shadow:0 8px 18px rgba(0,0,0,.26);padding:8px;position:absolute;top:calc(100% + 8px);left:0;width:372px}.course-menu-home{align-items:center;background:rgba(246,184,75,.1);border:1px solid rgba(246,184,75,.25);border-radius:7px;color:#f6f2e9;display:flex;font:700 .7rem Inter,system-ui,sans-serif;justify-content:space-between;letter-spacing:.03em;padding:10px 11px;text-decoration:none}.course-menu-home span{color:#f6b84b;font-size:.62rem;text-transform:uppercase}.course-menu-list{display:grid;gap:3px;grid-template-columns:repeat(2,minmax(0,1fr));margin-top:7px}.course-menu-list a,.study-menu button{border:1px solid transparent;border-radius:7px;color:#dbe4f2;cursor:pointer;display:block;font:500 .74rem/1.35 Inter,system-ui,sans-serif;padding:9px;text-align:left;text-decoration:none;width:100%}.course-menu-list a strong{color:#f6b84b;display:block;font-size:.65rem;letter-spacing:.05em;margin-bottom:3px}.course-menu-list a:hover,.course-menu-list a:focus-visible,.study-menu button:hover,.study-menu button:focus-visible{background:rgba(96,165,250,.13);border-color:rgba(96,165,250,.4);outline:none}.course-menu-list a[aria-current="page"],.study-menu button[aria-current="page"]{background:rgba(246,184,75,.15);border-color:rgba(246,184,75,.32);color:#fff}.course-menu-list a[aria-current="page"] strong{color:#fde68a}.study-jump{display:none}.study-menu{right:0;left:auto;width:270px}.study-menu-list{display:grid;gap:4px;grid-template-columns:1fr 1fr}.study-menu button{background:transparent;min-height:48px}.study-menu button .study-mode-icon{color:#f6b84b;display:block;font-size:.88rem;margin-bottom:3px}.study-menu button .study-mode-label{display:block}.course-nav-open{overflow:visible!important}@media(max-width:900px){.topbar,.top{align-items:center!important;gap:10px!important;height:60px!important;justify-content:initial!important;min-height:60px!important;overflow:visible!important;padding:0 max(12px,env(safe-area-inset-left))!important;padding-right:max(12px,env(safe-area-inset-right))!important;position:relative!important}.topbar-brand,.brand{display:none!important}.topbar .tab-btn,.top .tab{display:none!important}.course-jump{order:1}.study-jump{display:block;margin-left:auto;order:2}.course-jump summary,.study-jump summary{min-height:44px;padding:8px 10px}.course-jump-label{display:none}.study-jump-label{display:inline}.course-menu,.study-menu{border-radius:0 0 12px 12px;box-shadow:0 12px 22px rgba(0,0,0,.32);left:0;max-height:calc(100svh - 60px - env(safe-area-inset-top));overflow:auto;position:fixed;right:0;top:calc(60px + env(safe-area-inset-top));width:auto}.course-menu{padding:12px}.course-menu-list{grid-template-columns:1fr;gap:4px}.course-menu-list a{align-items:center;display:grid;grid-template-columns:70px 1fr;min-height:52px;padding:9px 10px}.course-menu-list a strong{font-size:.68rem;margin:0}.course-menu-home{min-height:46px}.study-menu{padding:10px 12px}.study-menu-list{gap:6px}.study-menu button{font-size:.78rem;min-height:56px;padding:8px}.content-area{height:calc(100svh - 60px)!important}.panel{height:calc(100svh - 60px)!important}}@media(max-width:380px){.study-jump-label{display:none}.course-jump summary,.study-jump summary{min-width:44px;padding:8px;justify-content:center}.course-menu-home span{display:none}.study-menu-list{grid-template-columns:1fr}.study-menu button{min-height:48px}}
  `;
  document.head.append(style);

  bar.querySelectorAll('select[aria-label="Choose subject"]').forEach((select) => select.remove());

  const jump = document.createElement('details');
  jump.className = 'course-jump';
  jump.innerHTML = `<summary aria-label="Switch course"><span>${current.code}</span><span class="course-jump-label">Courses</span><span class="course-chevron" aria-hidden="true">⌄</span></summary><div class="course-menu"><a class="course-menu-home" href="../index.html">All MAPC courses <span>Course library →</span></a><div class="course-menu-list">${courses.map((course) => `<a href="../${course.path}"${course.code === current.code ? ' aria-current="page"' : ''}><strong>${course.code}</strong><span>${course.name}</span></a>`).join('')}</div></div>`;
  bar.insertBefore(jump, bar.firstChild);

  const modeButtons = [...bar.querySelectorAll('.tab-btn, .tab')];
  const modeId = (button) => button.dataset.tab || (button.getAttribute('onclick') || '').match(/switchTab\(["']([^"']+)/)?.[1] || '';
  const modeName = (button) => button.textContent.replace(/[✦◇▶☷☰★✎]/g, '').trim();
  const activeMode = () => modeButtons.find((button) => button.classList.contains('active')) || modeButtons[0];

  if (modeButtons.length) {
    const studyJump = document.createElement('details');
    studyJump.className = 'study-jump';
    studyJump.innerHTML = `<summary aria-label="Open study tools"><span class="study-jump-label">Study tools</span><span class="study-chevron" aria-hidden="true">⌄</span></summary><div class="study-menu"><div class="study-menu-list">${modeButtons.map((button, index) => `<button type="button" data-study-target="${index}"><span class="study-mode-icon">${button.querySelector('.ni')?.textContent || '•'}</span><span class="study-mode-label">${modeName(button)}</span></button>`).join('')}</div></div>`;
    bar.insertBefore(studyJump, jump.nextSibling);

    const initialModeId = modeId(activeMode());
    const syncModeMenu = () => {
      const selected = activeMode();
      const selectedId = modeId(selected);
      studyJump.querySelector('.study-jump-label').textContent = modeName(selected) || 'Study tools';
      studyJump.querySelectorAll('[data-study-target]').forEach((button, index) => button.toggleAttribute('aria-current', modeId(modeButtons[index]) === selectedId));
    };
    let fromHistory = false;
    const openModeFromHash = () => {
      const requested = decodeURIComponent(location.hash.slice(1));
      const target = modeButtons.find((button) => modeId(button) === (requested || initialModeId));
      if (!target) return;
      fromHistory = true;
      target.click();
      fromHistory = false;
      syncModeMenu();
    };
    modeButtons.forEach((button) => button.addEventListener('click', () => {
      const id = modeId(button);
      if (!fromHistory && id && location.hash !== `#${encodeURIComponent(id)}`) history.pushState(null, '', `#${encodeURIComponent(id)}`);
      requestAnimationFrame(syncModeMenu);
    }));
    studyJump.querySelectorAll('[data-study-target]').forEach((button) => button.addEventListener('click', () => {
      modeButtons[Number(button.dataset.studyTarget)].click();
      studyJump.open = false;
    }));
    window.addEventListener('hashchange', openModeFromHash);
    openModeFromHash();
    syncModeMenu();

    studyJump.addEventListener('toggle', () => {
      if (studyJump.open) jump.open = false;
      bar.classList.toggle('course-nav-open', jump.open || studyJump.open);
    });
  }

  jump.addEventListener('toggle', () => {
    const studyJump = bar.querySelector('.study-jump');
    if (jump.open && studyJump) studyJump.open = false;
    bar.classList.toggle('course-nav-open', jump.open || studyJump?.open);
  });
  document.addEventListener('click', (event) => {
    if (!jump.contains(event.target)) jump.open = false;
    const studyJump = bar.querySelector('.study-jump');
    if (studyJump && !studyJump.contains(event.target)) studyJump.open = false;
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    jump.open = false;
    const studyJump = bar.querySelector('.study-jump');
    if (studyJump) studyJump.open = false;
  });
})();
