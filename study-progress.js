(() => {
  const states = ['not-started', 'in-progress', 'done', 'revise', 'ignored'];
  const labels = { 'not-started': 'Not started', 'in-progress': 'In progress', done: 'Done', revise: 'Need to revise', ignored: 'Ignoring' };

  function addStyle() {
    if (document.querySelector('#study-progress-style')) return;
    const s = document.createElement('style');
    s.id = 'study-progress-style';
    s.textContent = `.study-login{position:fixed;inset:0;z-index:9999;background:#0f172aee;display:grid;place-items:center;padding:20px}.study-profile,.study-item{background:#17243a;border:1px solid #334155;border-radius:8px;color:#e2e8f0}.study-profile{align-items:center;display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;margin:0 0 16px;padding:12px 14px}.study-profile p{margin:0}.study-progress{background:#0f172a;border-radius:999px;height:7px;overflow:hidden;width:180px}.study-progress i{background:#22c55e;display:block;height:100%;transition:width .2s}.study-item{margin-top:12px;padding:10px}.study-item summary{cursor:pointer;font-weight:700}.study-controls{display:flex;flex-wrap:wrap;gap:8px;margin-top:9px}.study-controls select,.study-controls textarea{background:#0f172a;border:1px solid #475569;border-radius:5px;color:#e2e8f0;font:inherit;padding:7px}.study-controls textarea{min-height:54px;resize:vertical;width:min(100%,420px)}.study-source{color:#94a3b8;font-size:.78rem;margin:8px 0 0}.study-visual{background:#eff6ff;border:1px solid #bfdbfe;border-radius:7px;color:#0f172a;margin:12px 0;padding:11px}.study-visual b{display:block;color:#1d4ed8;font-size:.75rem;text-transform:uppercase}.study-flow{align-items:center;display:flex;flex-wrap:wrap;font-size:.78rem;font-weight:700;gap:6px;margin-top:7px}.study-flow span{background:white;border:1px solid #93c5fd;border-radius:5px;padding:5px}.study-flow em{color:#2563eb;font-style:normal}.study-flashcard-progress{background:#17243a;border:1px solid #334155;border-radius:8px;color:#e2e8f0;margin-top:14px;padding:10px}.study-flashcard-progress .study-controls{margin-top:0}.study-item.status-not-started{border-left:4px solid #64748b}.study-item.status-in-progress{border-left:4px solid #38bdf8}.study-item.status-done{border-left:4px solid #22c55e}.study-item.status-revise{border-left:4px solid #f59e0b}.study-item.status-ignored{border-left:4px solid #94a3b8;opacity:.72}.study-item.status-done summary span{color:#86efac}.study-item.status-in-progress summary span{color:#7dd3fc}.study-item.status-revise summary span{color:#fcd34d}.study-item.status-ignored summary span{color:#cbd5e1}.line-visual svg{display:block;height:auto;margin-top:8px;width:100%}@media(max-width:600px){.study-profile{align-items:flex-start;flex-direction:column}.study-progress{width:100%}}`;
    document.head.append(s);
  }

  async function fetchProgress(userId, course) {
    const { data } = await window.sb.from('progress').select('item_key,status,note').eq('user_id', userId).eq('course', course);
    return Object.fromEntries((data || []).map(row => [row.item_key, row]));
  }

  async function upsertProgress(userId, course, itemKey, status, note) {
    await window.sb.from('progress').upsert(
      { user_id: userId, course, item_key: itemKey, status, note, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,course,item_key' }
    );
  }

  const m005VisualData = { 'pyq-1': ['Research process', ['Problem', 'Literature', 'Hypothesis', 'Design', 'Report']], 'pyq-2': ['True experiment', ['Manipulate IV', 'Control', 'Random assign', 'Measure DV']], 'pyq-3': ['Reliability methods', ['Test–retest', 'Parallel forms', 'Split-half', 'Inter-rater']], 'pyq-4': ['Validity', ['Internal: cause', 'External: generalise', 'Threats', 'Controls']], 'pyq-5': ['Variables', ['IV: cause', 'DV: outcome', 'EV: control']], 'pyq-6': ['Hypotheses', ['H₀: no effect', 'H₁: effect', 'Test', 'Decision']], 'pyq-7': ['Sampling', ['Population', 'Frame', 'Probability / non-probability', 'Sample']], 'pyq-8': ['Survey research', ['Define', 'Questionnaire', 'Sample', 'Collect', 'Analyse', 'Report']], 'pyq-9': ['Ex-post facto', ['Existing condition', 'Compare groups', 'Consider alternatives', 'Cautious inference']], 'pyq-10': ['Field experiment', ['Natural setting', 'Manipulate IV', 'Real behaviour', 'Less control']], 'pyq-11': ['Case study', ['Bounded case', 'Multiple sources', 'Contextual analysis', 'Insight']], 'pyq-12': ['Single-factor design', ['One IV', 'Levels', 'Compare conditions', 'DV']], 'pyq-13': ['Factorial design', ['Factor A', '×', 'Factor B', 'Main effects + interaction']], 'pyq-14': ['Quasi-experiment', ['Intervention', 'No random assignment', 'Comparison / series', 'Validity caution']], 'pyq-15': ['Correlational design', ['Measure X + Y', 'Coefficient', 'Direction / degree', 'No causation']], 'pyq-16': ['Causal-comparative', ['Existing group A', 'Compare', 'Existing group B', 'Alternative causes']], 'pyq-17': ['Qualitative and quantitative', ['Meaning / context', '↔', 'Measurement / testing']], 'pyq-18': ['Ethnography', ['Enter field', 'Observe', 'Field notes', 'Interpret culture']], 'pyq-19': ['Grounded theory', ['Data', 'Codes', 'Categories', 'Theory']], 'pyq-20': ['Discourse analysis', ['Text / talk', 'Transcribe', 'Patterns', 'Context + power']], 'pyq-21': ['Qualitative analysis and report', ['Organise', 'Code', 'Themes', 'Interpret', 'Report']] };

  function lineDiagram(key, title, steps) {
    const esc = x => String(x).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    if (key === 'pyq-13') return `<svg viewBox="0 0 620 170" role="img" aria-label="2 by 2 factorial design"><path d="M190 36H560M190 72H560M190 108H560M190 36V142M375 36V142M560 36V142" fill="none" stroke="#2563eb" stroke-width="2"/><text x="24" y="97" font-size="16" fill="#1e3a8a">Factor A</text><text x="260" y="22" font-size="16" fill="#1e3a8a">Factor B</text><text x="270" y="63" font-size="15">A1B1</text><text x="450" y="63" font-size="15">A1B2</text><text x="270" y="100" font-size="15">A2B1</text><text x="450" y="100" font-size="15">A2B2</text><text x="210" y="164" font-size="14" fill="#475569">Read main effects across rows/columns; interaction is the combined pattern.</text></svg>`;
    if (key === 'pyq-19') return `<svg viewBox="0 0 620 175" role="img" aria-label="Grounded theory coding cycle"><defs><marker id="a" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5 0 7z" fill="#2563eb"/></marker></defs><path d="M150 88C170 20 310 18 345 70M352 98C330 160 195 158 160 105" fill="none" stroke="#2563eb" stroke-width="3" marker-end="url(#a)"/><path d="M360 92C430 30 530 55 525 102M510 119C450 170 370 145 360 106" fill="none" stroke="#2563eb" stroke-width="3" marker-end="url(#a)"/><g fill="#fff" stroke="#2563eb" stroke-width="2"><rect x="82" y="65" width="105" height="42" rx="8"/><rect x="260" y="35" width="105" height="42" rx="8"/><rect x="445" y="70" width="105" height="42" rx="8"/><rect x="260" y="118" width="105" height="42" rx="8"/></g><g font-size="15" text-anchor="middle" fill="#0f172a"><text x="134" y="91">Data</text><text x="312" y="61">Codes</text><text x="497" y="96">Categories</text><text x="312" y="144">Theory</text></g></svg>`;
    const n = steps.length, w = 620, y = 72, gap = (w - 100) / (n - 1 || 1);
    const nodes = steps.map((x, i) => { const px = 50 + i * gap; return `<circle cx="${px}" cy="${y}" r="18" fill="#fff" stroke="#2563eb" stroke-width="2"/><text x="${px}" y="${y + 5}" text-anchor="middle" font-size="13" fill="#0f172a">${i + 1}</text><text x="${px}" y="${y + 42}" text-anchor="middle" font-size="12" fill="#0f172a">${esc(x)}</text>`; }).join('');
    const lines = steps.slice(1).map((_, i) => `<path d="M${68 + i * gap} ${y}H${32 + (i + 1) * gap}" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow)"/>`).join('');
    return `<svg viewBox="0 0 620 145" role="img" aria-label="${esc(title)} line diagram"><defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5 0 7z" fill="#2563eb"/></marker></defs>${lines}${nodes}</svg>`;
  }

  function addM005Visuals() {
    document.querySelectorAll('[data-course="m005"][data-study-key]').forEach(node => {
      const key = node.dataset.studyKey, entry = m005VisualData[key], box = node.querySelector('.study-item');
      if (!entry || !box || box.querySelector('.study-visual')) return;
      const [title, steps] = entry, visual = document.createElement('div');
      visual.className = 'study-visual line-visual';
      visual.innerHTML = `<b>${title}</b>${lineDiagram(key, title, steps)}`;
      box.append(visual);
    });
  }

  window.initStudyProgress = config => {
    addStyle();
    window.MapcAuth.requireUser(async user => {
      const refs = config.refs || {}, visual = config.visuals || {};
      const byKey = await fetchProgress(user.id, config.course);
      const paint = (node, box, status) => { node.dataset.revisionStatus = status; box.className = `study-item status-${status}`; box.querySelector('summary span').textContent = labels[status]; };
      const targets = config.targets();
      targets.forEach((node, index) => {
        const key = config.keys[index] || `${config.course}-${index + 1}`;
        const item = byKey[key] || { status: 'not-started', note: '' };
        node.dataset.studyKey = key;
        node.dataset.course = config.course;
        const box = document.createElement('details');
        box.innerHTML = `<summary><b>Revision status</b> · <span>${labels[item.status]}</span></summary><div class="study-controls"><select aria-label="Revision status">${states.map(x => `<option value="${x}" ${x === item.status ? 'selected' : ''}>${labels[x]}</option>`).join('')}</select><textarea placeholder="Revision note: what to focus on…"></textarea></div>${refs[key] ? `<details class="study-source"><summary>Source in course material</summary><p>${refs[key]}</p></details>` : ''}${visual[key] || ''}`;
        const select = box.querySelector('select'), note = box.querySelector('textarea');
        note.value = item.note;
        paint(node, box, item.status);
        const sync = async () => {
          byKey[key] = { status: select.value, note: note.value };
          await upsertProgress(user.id, config.course, key, select.value, note.value);
          paint(node, box, select.value);
          renderProfile();
        };
        select.onchange = sync;
        note.onchange = sync;
        node.append(box);
      });
      const profile = document.createElement('section');
      profile.className = 'study-profile';
      const displayName = window.MapcAuth.getProfile()?.full_name || 'Student';
      profile.innerHTML = `<p><b>${displayName}</b><br><small>${config.course} revision profile · synced to your account</small></p><div><p id="study-summary"></p><div class="study-progress"><i></i></div></div>`;
      document.body.insertBefore(profile, document.body.firstChild);
      function renderProfile() {
        const all = [...new Set(config.keys)];
        const items = all.map(k => byKey[k] || { status: 'not-started' });
        const active = items.filter(x => x.status !== 'ignored');
        const done = active.filter(x => x.status === 'done').length;
        const total = active.length;
        const pct = total ? Math.round(done / total * 100) : 100;
        profile.querySelector('#study-summary').textContent = done === total ? 'Hurray, you are ready to give exams — all the best!' : `${done}/${total} completed · ${pct}%`;
        profile.querySelector('i').style.width = `${pct}%`;
      }
      renderProfile();
    });
    if (config.course === 'm005') setTimeout(addM005Visuals, 0);
  };

  window.initFlashcardProgress = config => {
    addStyle();
    const { course, mount } = config;
    let currentIndex = 0, byKey = {}, widget = null;
    const keyFor = index => typeof index === 'number' ? `flash-${index + 1}` : `flash-${index}`;
    window.MapcAuth.requireUser(async user => {
      byKey = await fetchProgress(user.id, course);
      widget = document.createElement('div');
      widget.className = 'study-flashcard-progress';
      widget.innerHTML = `<div class="study-controls"><select aria-label="Revision status">${states.map(x => `<option value="${x}">${labels[x]}</option>`).join('')}</select><textarea placeholder="Revision note: what to focus on…"></textarea></div>`;
      mount.after(widget);
      const select = widget.querySelector('select'), note = widget.querySelector('textarea');
      const paint = () => {
        const item = byKey[keyFor(currentIndex)] || { status: 'not-started', note: '' };
        select.value = item.status;
        note.value = item.note;
      };
      const sync = async () => {
        const key = keyFor(currentIndex);
        byKey[key] = { status: select.value, note: note.value };
        await upsertProgress(user.id, course, key, select.value, note.value);
      };
      select.onchange = sync;
      note.onchange = sync;
      paint();
      window.MapcFlashcardProgress = { notifyIndex(i) { currentIndex = i; paint(); } };
    });
  };

  // Total PYQ Analysis priority topics per course (the homepage revision checklist).
  // Keep in sync with each course's PYQ Analysis #priority-table row count.
  const PYQ_TOPIC_TOTALS = { m003: 24, m004: 12, m005: 21, m006: 17 };

  window.initHomeProgress = () => {
    const nodes = [...document.querySelectorAll('[data-progress]')];
    if (!nodes.length) return;
    const render = async user => {
      if (!user) {
        nodes.forEach(node => { node.innerHTML = `<span>Sign in to track revision</span><i aria-hidden="true"><b style="width:0%"></b></i>`; });
        return;
      }
      const { data } = await window.sb.from('progress').select('course,item_key,status').eq('user_id', user.id);
      const byCourse = {};
      (data || []).forEach(row => { (byCourse[row.course] ||= []).push(row); });
      nodes.forEach(node => {
        const course = node.dataset.progress;
        const total = PYQ_TOPIC_TOTALS[course];
        if (!total) { node.innerHTML = `<span>PYQ analysis coming soon</span><i aria-hidden="true"><b style="width:0%"></b></i>`; return; }
        const topics = (byCourse[course] || []).filter(row => row.item_key.startsWith('pyq-'));
        const ignored = topics.filter(row => row.status === 'ignored').length;
        const done = topics.filter(row => row.status === 'done').length;
        const denom = Math.max(total - ignored, 0) || total;
        const percent = denom ? Math.round(done / denom * 100) : 0;
        node.innerHTML = `<span>${done}/${denom} priority topics revised</span><i aria-hidden="true"><b style="width:${percent}%"></b></i>`;
      });
    };
    window.MapcAuth.onChange(render);
    render(window.MapcAuth.getUser());
  };
})();
