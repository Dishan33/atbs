(() => {
  const SUPABASE_URL = 'https://dhvpdopwsmupuqkbujsd.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_rSh97IPrEnz0LM1jKCp-sQ_hJltMb8P';
  window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
})();
