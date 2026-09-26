# Your portfolio site

A plain HTML/CSS/JS portfolio site, backed by Firebase, ready to deploy on
GitHub Pages. No build step, no coding needed to run or update it.

## What's in here

- `index.html`, `about.html`, `projects.html`, `contact.html` — the public site
- `admin.html` / `admin.css` / `admin.js` — your private editing dashboard
- `firebase-init.js` — connects the site to your Firebase project (already filled in)
- `site-data.js` — shared functions that read/write your content
- `script.js` — shared logic for the public pages
- `styles.css` — the look of the public site (espresso & cream theme)
- `tracker.js` — optional page-view counter (safe to ignore or delete)
- `firestore.rules`, `storage.rules` — security rules to paste into Firebase
- `assets/` — optional folder for your own files (not required)

## One-time setup in Firebase (5–10 minutes)

You already created the project and gave me its config, so three things
are left, all in the [Firebase console](https://console.firebase.google.com):

1. **Authentication** → Sign-in method → enable **Email/Password**.
   Then go to the **Users** tab → **Add user** → enter an email and
   password you'll remember. That's your admin login — nobody else can
   get one, since there's no public sign-up form anywhere on the site.

2. **Firestore Database** → create a database if you haven't already
   (any region is fine). Then go to the **Rules** tab, delete what's
   there, and paste in the contents of `firestore.rules` from this
   folder. Click **Publish**.

3. **Storage** → set it up if you haven't already. Go to its **Rules**
   tab, delete what's there, and paste in the contents of
   `storage.rules`. Click **Publish**.

That's it — no other configuration needed.

## Deploying to GitHub Pages (no git required)

1. Create a new repository on GitHub (public or private both work).
2. On the repo's main page, click **Add file → Upload files**, then drag
   in *every file and folder* from this project. Commit the upload.
3. Go to the repo's **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to "Deploy from a
   branch", branch `main`, folder `/ (root)`. Save.
4. Wait about a minute, then refresh — GitHub will show you your live
   URL, something like `https://yourusername.github.io/your-repo/`.

Your site is now live at that URL, and `admin.html` (e.g.
`https://yourusername.github.io/your-repo/admin.html`) is your private
dashboard.

## Using the admin dashboard

Open `admin.html`, log in with the email/password you created above, and
you'll see:

- **Hero** — your name, title, tagline, stats, and profile photo
- **About** — your about paragraph
- **Contact** — email, an optional "book a call" link, and up to three
  social links
- **Projects** — add, edit, or delete projects. Each project has a
  title, a category (this becomes a filter chip on the Portfolio page —
  reuse the same category text across projects to group them), a cover
  image, and optional extra gallery images.

Every save shows up on the live site immediately — nothing needs to be
re-uploaded or redeployed.

## Notes

- The site starts with placeholder text ("Your Name", sample tagline,
  etc.) until you log in and fill in your real content — that's expected.
- `tracker.js` quietly counts page views per page in Firestore, under a
  document called `analytics/views`, purely for your own curiosity. To
  remove it: delete `tracker.js`, remove its import line from the top of
  `script.js`, and delete the `analytics` block from `firestore.rules`.
- If you ever want a custom domain instead of the `github.io` address,
  GitHub Pages supports that under Settings → Pages → Custom domain —
  ask me if you'd like help with that later.
