import Home from './Home.jsx'
import Answer from './Answer.jsx'
import Context from './Context.jsx'
import DesignSystem from './DesignSystem.jsx'
import { Wallet, Trust, PublicPersonal } from './Placeholder.jsx'

// Flows = the narrative chapters / bricks of the 21st Europe story.
// Chapter-agnostic names; built ones reuse real scenes, the rest are named placeholders to fill.
export default [
  { id: 'home', title: 'Home', desc: 'Ask Europe anything', version: '0.3.0', author: 'team', updated: '2026-06-14', Component: Home },
  { id: 'talk', title: 'Talk', desc: 'The answer, as a conversation', version: '0.2.0', author: 'team', updated: '2026-06-13', Component: Answer },
  { id: 'context', title: 'Context', desc: 'EU → country', version: '0.4.0', author: 'team', updated: '2026-06-13', Component: Context },
  { id: 'widgets', title: 'Widgets', desc: 'Answer as a tool', version: '0.1.0', author: 'team', updated: '2026-06-13', Component: DesignSystem },
  { id: 'wallet', title: 'Wallet', desc: 'EUDI identity & footprint', version: '0.0.1', author: 'team', updated: '2026-06-14', Component: Wallet },
  { id: 'trust', title: 'Trust', desc: 'Is this true? — fact-check', version: '0.0.1', author: 'team', updated: '2026-06-14', Component: Trust },
  { id: 'public-personal', title: 'Public / Personal', desc: 'Public → private handoff', version: '0.0.1', author: 'team', updated: '2026-06-14', Component: PublicPersonal }
]
