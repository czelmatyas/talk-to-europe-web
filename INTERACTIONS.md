# Talk to Europe — interactions & motion reference

What's possible in the prototype now that it runs on **React + Framer Motion**, what's already wired, and copy-paste patterns for adding more. Each prototype lives in `src/protos/`.

---

## Already wired (try these in the running app)

| Interaction | Where | How it feels |
|---|---|---|
| **Switch prototype** | anywhere | Long-press (mouse-hold ~0.6s) → proto menu springs up; protos cross-fade |
| **Country context** | Context proto | Type a country → outlined suggestion pills spring in → tap to apply |
| **Country picker** | Context proto, `+` | Searchable modal sheet (Claude-iOS style), check on the selected |
| **Gradient follows country** | global | Picking a country crossfades the whole gradient (~0.9s) to that palette |
| **Living gradient** | global | Slow autonomous drift behind everything |
| **Star avatar** | composer | 12 EU stars orbit on a masked circle, continuously |
| **Answer-as-a-tool** | Home / Answer | Cards rise in with a spring; buttons, source chips |
| **Stateful DS** | Design system | Preference select, EU/national segmented toggle |
| **Toast** | global | Proto name + version on switch |

---

## What Framer Motion unlocks (capabilities)

1. **Enter / exit** — `AnimatePresence` animates things mounting *and* unmounting (modals, lists, toasts, screen changes).
2. **Springs & tweens** — physics-based motion: `transition={{ type:'spring', stiffness, damping }}`.
3. **Layout animations** — add `layout` and an element auto-animates when its size/position changes (reflows, expanding cards).
4. **Shared-element transitions** — give two elements the same `layoutId` and one *morphs* into the other across states (the big React-only unlock).
5. **Gestures** — `whileHover`, `whileTap`, and `drag` (drag-to-dismiss sheets, draggable cards, swipe).
6. **Scroll-linked** — `whileInView` (reveal on scroll), `useScroll` (progress-driven motion).
7. **Stagger / orchestration** — `staggerChildren` for list reveals; `variants` for named multi-state sequences.

---

## Copy-paste patterns (used in this codebase)

**Entrance ("rise")**
```jsx
const rise = { initial:{opacity:0,y:14}, animate:{opacity:1,y:0},
  transition:{ type:'spring', stiffness:420, damping:34 } }
<motion.div className="dscard" {...rise}>…</motion.div>
```

**Bottom sheet / modal (enter + exit)**
```jsx
<AnimatePresence>{open && [
  <motion.div key="b" className="cmback" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={close}/>,
  <motion.div key="s" className="cmsheet" initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}}
    transition={{type:'spring',stiffness:440,damping:42}}>…</motion.div>
]}</AnimatePresence>
```

**Cross-fade between screens** (App.jsx)
```jsx
<AnimatePresence mode="wait">
  <motion.div key={activeId} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>…</motion.div>
</AnimatePresence>
```

**Tap / hover feedback**
```jsx
<motion.button whileTap={{scale:.96}} whileHover={{scale:1.02}}>…</motion.button>
```

**Drag-to-dismiss a sheet**
```jsx
<motion.div drag="y" dragConstraints={{top:0,bottom:0}} dragElastic={0.2}
  onDragEnd={(e,info)=>{ if(info.offset.y>120) close() }}>…</motion.div>
```

**Shared-element morph** (e.g. composer → first message)
```jsx
{!sent && <motion.div layoutId="composer" />}
{sent  && <motion.div layoutId="composer" />}  // Framer morphs between them
```

---

## Ideas worth prototyping next (interaction beats from the story)

- **Composer → conversation morph** (`layoutId`): the input bar lifts into the first message.
- **Answer card → fullscreen** (`layoutId`): tap a card, it expands to a detail view; tap back, it returns.
- **Swipe between answers** (`drag="x"`) in a carousel (youth / mobility match cards).
- **Public → private handoff**: a QR card that, on "continue", slides the conversation onto a phone frame.
- **EU → national reveal**: segmented toggle with the body text sliding/crossfading; layout-animate the source chips.
- **Stagger the country list** in the modal as it opens.
- **Pull-to-refresh / pull-down** to reveal the daily "Pulse" cards.

---

## How the team adds an interaction

1. Edit (or add) a file in `src/protos/` — use `motion.*` and the patterns above.
2. Update the entry's `version` / `author` / `updated` in `src/protos/index.js`.
3. Commit & push — Vercel rebuilds and deploys. Long-press → it's in the menu.

*Run locally: `npm install` then `npm run dev` (→ http://localhost:5173). Note: don't paste shell comments after a command — zsh passes `#…` as arguments.*
