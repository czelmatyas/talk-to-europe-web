# Talk to Europe — prototype (React + Vite + Framer Motion)

Interactive prototype for the BP005 "Talk to Europe" narrative. Recorded clips drop into the narrative's placeholders.

## Run locally

```
npm install
npm run dev      # → http://localhost:5173
```

## How the team ships changes (PR-based auto-deploy)

This repo is connected to Vercel, so **you never deploy by hand**:

1. Make a branch: `git checkout -b your-change`
2. Edit / add a proto in `src/protos/` (see `INTERACTIONS.md` for patterns), bump its version in `src/protos/index.js`.
3. Commit and push: `git push -u origin your-change`
4. Open a Pull Request on GitHub.
   → Vercel posts a **unique preview URL** on the PR within ~1 min. Share it, record from it, review it.
5. Merge the PR into `main` → Vercel auto-deploys to the **production** URL.

`main` is always the live build. Preview URLs are per-PR and disposable.

## Structure

- `src/App.jsx` — stage: gradient backdrop, grain, long-press proto menu, panel centering
- `src/protos/` — one file per prototype, registered in `index.js`
- `src/components/` — `GradientBackdrop`, `StarAvatar`, `ProtoMenu`
- `src/lib/` — `palettes.js` (EU + 27 country palettes), `colors.js`
- `src/styles.css` — design system + layout (panel width via the `--panel` variable)
- `INTERACTIONS.md` — what's possible + copy-paste motion patterns
