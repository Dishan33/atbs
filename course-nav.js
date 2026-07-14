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
    .course-jump{flex:0 0 auto;position:relative;z-index:1001}.course-jump summary{align-items:center;background:#0f172a;border:1px solid rgba(246,242,233,.18);border-radius:7px;color:#f6f2e9;cursor:pointer;display:flex;font:700 .67rem Inter,system-ui,sans-serif;gap:7px;letter-spacing:.04em;list-style:none;padding:8px 10px;white-space:nowrap}.course-jump summary::-webkit-details-marker{display:none}.course-jump summary:focus-visible{outline:2px solid #f6b84b;outline-offset:2px}.course-jump .course-jump-label{color:#94a3b8;font-weight:500}.course-jump .course-chevron{color:#f6b84b;font-size:.78rem;transition:transform .16s ease}.course-jump[open] .course-chevron{transform:rotate(180deg)}.course-menu{background:#17233a;border:1px solid rgba(246,242,233,.18);border-radius:10px;box-shadow:0 18px 44px rgba(0,0,0,.34);padding:8px;position:absolute;top:calc(100% + 8px);left:0;width:350px}.course-menu-home{align-items:center;background:rgba(246,184,75,.1);border:1px solid rgba(246,184,75,.24);border-radius:7px;color:#f6f2e9;display:flex;font:700 .69rem Inter,system-ui,sans-serif;justify-content:space-between;letter-spacing:.04em;padding:10px 11px;text-decoration:none}.course-menu-home span{color:#f6b84b;font-size:.62rem;text-transform:uppercase}.course-menu-list{display:grid;gap:3px;grid-template-columns:repeat(2,minmax(0,1fr));margin-top:7px}.course-menu-list a{border:1px solid transparent;border-radius:7px;color:#cbd5e1;display:block;font:500 .72rem/1.3 Inter,system-ui,sans-serif;padding:9px;text-decoration:none}.course-menu-list a strong{color:#f6b84b;display:block;font-size:.65rem;letter-spacing:.05em;margin-bottom:3px}.course-menu-list a:hover,.course-menu-list a:focus-visible{background:rgba(96,165,250,.12);border-color:rgba(96,165,250,.35);outline:none}.course-menu-list a[aria-current="page"]{background:rgba(246,184,75,.15);border-color:rgba(246,184,75,.3);color:#f8fafc}.course-menu-list a[aria-current="page"] strong{color:#fde68a}@media(max-width:768px){.course-jump summary{gap:5px;padding:7px 8px}.course-jump .course-jump-label{display:none}.course-jump.course-jump--open{position:static}.topbar.course-nav-open,.top.course-nav-open{overflow:visible!important}.course-jump .course-menu{left:12px;position:fixed;right:12px;top:64px;width:auto}.course-menu-list{grid-template-columns:1fr 1fr}.course-menu-list a{min-height:52px}.course-menu-home{padding:10px}}@media(max-width:480px){.course-jump .course-menu{top:58px}.course-menu-list a{font-size:.68rem;padding:8px}.course-menu-list a strong{font-size:.61rem}}
  `;
  document.head.append(style);
  bar.querySelectorAll('select[aria-label="Choose subject"]').forEach((select) => select.remove());
  const jump = document.createElement('details');
  jump.className = 'course-jump';
  jump.innerHTML = `<summary aria-label="Switch course"><span>${current.code}</span><span class="course-jump-label">Courses</span><span class="course-chevron">⌄</span></summary><div class="course-menu"><a class="course-menu-home" href="../index.html">All MAPC courses <span>Course library →</span></a><div class="course-menu-list">${courses.map((course) => `<a href="../${course.path}"${course.code === current.code ? ' aria-current="page"' : ''}><strong>${course.code}</strong>${course.name}</a>`).join('')}</div></div>`;
  bar.insertBefore(jump, bar.firstChild);
  jump.addEventListener('toggle', () => bar.classList.toggle('course-nav-open', jump.open));
  document.addEventListener('click', (event) => { if (!jump.contains(event.target)) jump.open = false; });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') jump.open = false; });
})();
