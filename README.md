# Talk to Europe — prototype

Interactive prototype for the "Talk to Europe" narrative (React + Vite + Framer Motion). We build the interactions live here and **record finished clips straight out of the app** — no After Effects. Everyone keeps their own versions, and you can remix anyone's.

Live: **https://talk-to-europe-web.vercel.app**

## You don't need the terminal — just talk to Claude

Everything below is something you say to your Claude (in Cowork). It runs the git/commands for you.

**First time (once):**
1. Make a free GitHub account → https://github.com/signup
2. Send your GitHub username to Mátyás so he can add you as a collaborator.
3. Sign in to GitHub once (GitHub Desktop's login is the easy way).

**Start your own version** — paste to Claude, swap the name:
> Clone https://github.com/czelmatyas/talk-to-europe-web and make me a new branch called NAME, install and run it, then push and give me my preview link.

You get your own live URL (`…-git-NAME-…vercel.app`) to record from and share.

**Remix someone else's version** — open the app, **long-press** anywhere to open the menu, find their version under "Versions", and hit **Remix** — it copies a ready prompt. Paste it to Claude, swap NAME, done.

**Change a specific prototype** — just tell Claude which one:
> Edit the Talk prototype so the answer card is taller, then push.

(Flows are: Talk · Widgets · Wallet · Trust · Public/Personal.)

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
