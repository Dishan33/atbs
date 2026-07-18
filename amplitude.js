import * as amplitude from '@amplitude/unified';

if (typeof window !== 'undefined' && location.hostname === 'ignou-seven.vercel.app' && !window.__mapcAmplitudeInitialized) {
  window.__mapcAmplitudeInitialized = true;
  amplitude.initAll('e611a4b6253d55ffb130021595962fb8', {"analytics":{"autocapture":true},"sessionReplay":{"sampleRate":1}});

  const track = (event, properties = {}) => amplitude.track(event, { page: document.title, ...properties });

  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const target = event.target.closest('a.course, .course-menu a, [data-profile-signout], [data-sheet], .subtab-btn, [data-tab], .tab-btn, .tab');
    if (!target) return;

    if (target.matches('a.course')) track('Course Opened', { course: target.querySelector('small')?.textContent });
    else if (target.matches('.course-menu a')) track('Course Switched', { destination: target.textContent.trim() });
    else if (target.matches('[data-profile-signout]')) track('Local Profile Removed');
    else if (target.matches('[data-sheet], .subtab-btn')) track('Cheat Sheet Opened', { sheet: target.dataset.sheet || target.textContent.trim() });
    else track('Study Tool Opened', { tool: target.dataset.tab || target.textContent.trim() });
  });

  document.addEventListener('change', event => {
    if (event.target instanceof HTMLSelectElement && event.target.matches('select.course')) {
      track('Course Switched', { destination: event.target.selectedOptions[0]?.textContent });
    }
  });

  document.addEventListener('submit', event => {
    if (event.target instanceof HTMLFormElement && event.target.closest('#auth-shell')) track('Local Profile Created');
  });
}
