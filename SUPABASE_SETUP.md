# Cross-device study profiles

The site is ready to sync MPC-005 and MPC-006 revision progress through Supabase. Complete these one-time project settings before adding the two public values to `study-progress-config.js`.

1. Create a Supabase project and open **SQL Editor**.
2. Run [`supabase/study-progress.sql`](supabase/study-progress.sql).
3. In **Authentication → URL Configuration**, set the Site URL to `https://atbs-dun.vercel.app` and add `https://atbs-dun.vercel.app/**` plus `http://127.0.0.1:4175/**` to Redirect URLs for local testing.
4. In the project **Connect** dialog, copy the Project URL and publishable (or anon) key into `study-progress-config.js`. Do not use the service-role key.
5. In **Authentication → Providers → Email**, leave Email enabled. Magic-link sign-in is used; students do not need a password.

Existing device-local entries are copied to the student's cloud profile after their first magic-link sign-in. Thereafter the same email retrieves the same profile, statuses, and notes on every device.
