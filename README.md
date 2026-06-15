# Talk to Europe — prototype

Interactive prototype for the "Talk to Europe" narrative (React + Vite + Framer Motion). We build the interactions live here and **record finished clips straight out of the app** — no After Effects. Everyone keeps their own versions, and you can remix anyone's.

Live: **https://talk-to-europe-web.vercel.app**

## No terminal needed — you just talk to Claude

**First time (once):**
1. Make a free GitHub account → https://github.com/signup, send your username to Mátyás so he adds you as a collaborator.
2. Install **GitHub Desktop** (https://desktop.github.com), sign in, and clone `talk-to-europe-web`. (This also sets up your git login, so Claude can push later.)
3. In Cowork, **select the cloned folder as your context.**

**Then everything is a prompt to Claude:**
> Make me a new branch called NAME, edit the Talk prototype so the answer card is taller, then commit and push and give me my preview link.

Your live link: `talk-to-europe-web-git-NAME-matyas-9772s-projects.vercel.app` — record from it, share it. Flows you can ask for: **Talk · Widgets · Wallet · Trust · Public/Personal**.

**Remix someone else's version:** open the app → **long-press** anywhere → under "Versions" hit **Remix** on a deployment → it copies a ready prompt (just swap NAME) → paste to Claude.

> If a push ever fails from Claude, just open GitHub Desktop and click **Push** — same result.

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
