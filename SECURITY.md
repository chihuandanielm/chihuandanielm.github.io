# Security notes

This is a static site: GitHub Pages serves plain HTML, CSS, JavaScript, images and fonts.
There is no server, database, login, user account, API or file upload, so there is nothing
here that stores or processes visitor data.

## What the site does to stay safe
- **Content Security Policy** (in `index.html`): scripts, styles, fonts and images may only come
  from this site. The only outside sources allowed are the Spotify player frame and the Formspree
  form endpoint. Inline scripts and inline styles are blocked, so injected code cannot run.
- **No third-party tracking**: no analytics, cookies, ads or trackers. Fonts are hosted here,
  so visitors' IP addresses are not sent to a font provider.
- **No referrer**: links to other sites do not reveal which page a visitor came from.
- **Clickjacking**: the page hides itself and breaks out if another site embeds it in a frame.
- **External links** open with `rel="noopener noreferrer"`.
- **Contact form**: posts directly to Formspree; length limits, an email format check and a
  hidden spam trap field. The site itself never sees or stores what is sent.
- **Images and resume**: location and camera metadata stripped before publishing.
- **No secrets** in the code or its history.

## What is outside this repository
- **GitHub Pages** keeps standard server logs (including IP addresses) for operating the service.
  They are not visible to the site owner and are covered by GitHub's privacy statement.
- **Formspree** receives form submissions (and, like most form services, the sender's IP for
  spam filtering). Turn on "don't store submissions" / data retention limits in the Formspree
  dashboard if desired.
- **Spotify** loads its player when a visitor reaches the music section.

## Account checklist
- Two-factor authentication on GitHub and Formspree.
- Settings → Emails → "Keep my email addresses private".
