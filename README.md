# Talk to Europe — prototype

Interactive prototype for the "Talk to Europe" narrative (React + Vite + Framer Motion). We build the interactions live here and **record finished clips straight out of the app** — no After Effects. Everyone keeps their own versions, and you can remix anyone's.

Live: **https://talk-to-europe-web.vercel.app**

## No terminal, no tokens — GitHub Desktop for git, Claude for editing

Claude can't reach the internet from its sandbox, so **all git happens in GitHub Desktop** (it has your login + network). Claude just **edits the files**. You do **not** need a personal access token or a Vercel account.

**First time (once):**
1. Make a free GitHub account → https://github.com/signup, send your username to Mátyás to be added as a collaborator.
2. Install **GitHub Desktop** (https://desktop.github.com) → sign in → clone `talk-to-europe-web`.
3. In Cowork, **select the cloned folder as your context.**

**Make your version:**
1. GitHub Desktop: **Current Branch → New Branch**, name it your name (e.g. `lena`).
2. Tell Claude what to change — e.g. *"edit the Talk prototype so the answer card is taller."*
3. GitHub Desktop: **Commit**, then **Push / Publish branch**.
4. Your live link (automatic, no login): `talk-to-europe-web-git-NAME-matyas-9772s-projects.vercel.app`

Flows you can ask Claude for: **Talk · Widgets · Wallet · Trust · Public/Personal**.

**Remix someone's version:** open the app → **long-press** → under "Versions" hit **Remix** (it copies the steps). In GitHub Desktop: **Branch → Merge into current branch → pick their branch**, then tweak with Claude and push — it lands as a new version on your branch.

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
