# Talk to Europe — prototype

Interactive prototype for the "Talk to Europe" narrative (React + Vite + Framer Motion). We build the interactions live here and **record finished clips straight out of the app** — no After Effects. Everyone keeps their own versions, and you can remix anyone's.

Live: **https://talk-to-europe-web.vercel.app**

## How you work: Claude edits, you click Push

Claude can't push (its sandbox has no internet), so the one publish step is a button in **GitHub Desktop**. **No tokens, no Vercel account, no terminal** — ignore any prompt asking for those.

**First time (once):**
1. Make a free GitHub account → https://github.com/signup, send your username to Mátyás to be added as a collaborator.
2. Install **GitHub Desktop** (https://desktop.github.com) → sign in → clone `talk-to-europe-web`.
3. In Cowork, **select the cloned folder as context.**
4. In GitHub Desktop: **Current Branch → New Branch**, name it your name (e.g. `lena`).

**Each change:**
1. Tell Claude what to edit (prototypes are in `src/protos/`) — e.g. *"edit the Talk prototype so the answer card is taller."*
2. Open GitHub Desktop → it shows the change → write a short summary → **Commit** → **Push origin**.
3. Live link (automatic, no login): `talk-to-europe-web-git-NAME-matyas-9772s-projects.vercel.app`

Flows you can ask Claude for: **Talk · Widgets · Wallet · Trust · Public/Personal**.

**Remix someone's version:** open the app → **long-press** → "Versions" → **Remix** copies the steps → in GitHub Desktop: **Branch → Merge into current branch → pick their branch → Push origin**.

### Paste this to your Claude once

> I'm working on the talk-to-europe-web repo. The folder is connected as context and my branch is set up in GitHub Desktop. Your only job is to edit the prototype files (in `src/protos/`) when I ask. Do NOT try to push, clone, fetch, or run git, and never suggest personal access tokens, Vercel logins, or xcode-select — none of that is needed. When a change is ready, just tell me and I'll Commit + "Push origin" in GitHub Desktop.

## How it works

- **Long-press anywhere** → the menu: switch flows, see everyone's deployments (your version history is automatic), pick a recording frame, edit the gradient, restart.
- **Every push gets its own live URL.** `main` is just the shared starting point — nothing has to go there.
- Each prototype is one self-contained file in `src/protos/` (listed in `index.js`). Duplicate a file to make a variant; it shows up in the menu.

## Structure (for reference)

- `src/protos/` — one file per flow, registered in `index.js`
- `src/components/` — `GradientBackdrop`, `StarAvatar`, `StarMascot`, `ProtoMenu`, `GradientEditor`
- `src/lib/` — `palettes.js` (EU + 27 country palettes), `colors.js`
- `src/styles.css` — design system + layout
- `INTERACTIONS.md` — motion patterns + ideas to try

Running it by hand (if you want): `npm install` then `npm run dev`.
