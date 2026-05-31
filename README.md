# Our Baby Journey 👶

A little website for Jason & Erika to follow the pregnancy week by week.

## Pages
- **Home** — welcome + live week countdown
- **Progress** — baby's size & milestones for the current week (auto-calculated)
- **Tips & Tricks** — morning sickness, sleep, comfort & well-being
- **Diet & Do's** — what to eat/avoid and what to do/skip
- **Gallery** — your photos

## Running it
```bash
npm install      # first time only
npm run dev      # start the local site, then open the printed URL
```

To make a shareable/hostable build:
```bash
npm run build    # output goes to dist/
npm run preview  # preview the built site
```

## The one file you edit
`src/config.js` — your names, baby nickname, and **due date**.
The week tracker recalculates itself from the due date every time the page loads.

## Adding photos
Easiest way: open the site (on your **phone** or computer), go to the **Gallery**
page, and tap **＋ Add photos**. Pick from your camera roll or take a new photo —
it uploads and appears right away. Because the whole site is behind the shared
password, only people who've logged in can add or see photos.

Behind the scenes the upload goes to a small service (`server/upload.mjs`) that
saves the file into the server's photos folder (`PHOTOS_DIR`); Caddy serves that
folder at `/photos/`. You can still drop files into that folder directly on the
server if you prefer. See `DEPLOY.md`.

## Editing the content
- Week sizes & facts: `src/data/weeks.js`
- Tips: `src/data/tips.js`
- Diet & do's/don'ts: `src/data/diet.js`

> The health content is general info, not medical advice — always follow your provider.
