# Talk to Europe — prototype (React + Vite + Framer Motion)

Interactive prototype for the BP005 "Talk to Europe" narrative. Recorded clips drop into the narrative's placeholders.

## Run locally

```
npm install
npm run dev      # → http://localhost:5173
```

## How we work: a branch per person, remix freely

This is an **ideation playground**, not a production app. There's no release gate. The rule is simple: **everyone gets their own branch, and Vercel gives every branch its own live URL.** `main` is just a shared starting point.

**First-time setup (once)**
1. **Register a free GitHub account** at https://github.com/signup (skip if you have one).
2. Send your GitHub username to the repo owner so they can **add you as a collaborator** — that's what lets you push your own branch. (You do *not* need a Vercel account.)
3. Install **git** (or [GitHub Desktop](https://desktop.github.com) for a no-terminal option) and sign in.
4. Clone the repo: `git clone https://github.com/czelmatyas/talk-to-europe-web.git`

**Start your own version**
```
git checkout main && git pull
git checkout -b lena            # your name (or name/idea)
# ...edit protos, push...
git push -u origin lena
```
Vercel auto-deploys it to `talk-to-europe-web-git-lena-<scope>.vercel.app` — your own stable link to record from and share.

**Remix someone else's version** — just branch off theirs:
```
git fetch
git checkout -b lena-remix origin/marton    # start from Márton's branch
```
Tweak, push, and you've got your own live remix without touching theirs.

**Pull a single idea across** — copy the proto file. Every prototype is one self-contained file in `src/protos/` (registered in `index.js`), so grabbing someone's `Context.jsx` variant into your branch is a copy-paste. Bump the `author` field so it's clear whose it is.

**`main` = the shared baseline.** Anyone can merge something nice into it when it's worth everyone starting from, but nothing has to go there. Each person's branch is its own world.

## Structure

- `src/App.jsx` — stage: gradient backdrop, grain, long-press proto menu, panel centering
- `src/protos/` — one file per prototype, registered in `index.js`
- `src/components/` — `GradientBackdrop`, `StarAvatar`, `ProtoMenu`
- `src/lib/` — `palettes.js` (EU + 27 country palettes), `colors.js`
- `src/styles.css` — design system + layout (panel width via the `--panel` variable)
- `INTERACTIONS.md` — what's possible + copy-paste motion patterns
