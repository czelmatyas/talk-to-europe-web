import Talk from './Talk.jsx'
import DesignSystem from './DesignSystem.jsx'
import { Wallet, Trust, PublicPersonal } from './Placeholder.jsx'

// Flows = the narrative chapters / bricks of the 21st Europe story.
// Talk merges the old Home + Talk + Context — one conversation started from one input field.
// Archived (kept in repo, off the list): Home.jsx, Answer.jsx, Context.jsx
export default [
  { id: 'talk', title: 'Talk', desc: 'Ask by text or voice, in your context', version: '0.6.0', author: 'team', updated: '2026-06-15', Component: Talk, palette: ['#6D97EB', '#D5E4EE', '#FFE0B0'] },
  { id: 'widgets', title: 'Widgets', desc: 'Answer as a tool', version: '0.1.0', author: 'team', updated: '2026-06-13', Component: DesignSystem },
  { id: 'wallet', title: 'Wallet', desc: 'EUDI identity & footprint', version: '0.0.1', author: 'team', updated: '2026-06-14', Component: Wallet },
  { id: 'trust', title: 'Trust', desc: 'Is this true? — fact-check', version: '0.0.1', author: 'team', updated: '2026-06-14', Component: Trust },
  { id: 'public-personal', title: 'Public / Personal', desc: 'Public → private handoff', version: '0.0.1', author: 'team', updated: '2026-06-14', Component: PublicPersonal }
]
