import Home from './Home.jsx'
import Answer from './Answer.jsx'
import Context from './Context.jsx'
import DesignSystem from './DesignSystem.jsx'

export default [
  { id: 'home', title: 'Home — conversation', slot: 'Entry', version: '0.3.0', author: 'team', updated: '2026-06-13', Component: Home },
  { id: 'answer-train', title: 'Answer — train delay', slot: 'Answer', version: '0.2.0', author: 'team', updated: '2026-06-13', Component: Answer },
  { id: 'context', title: 'Context — EU → country', slot: 'Context', version: '0.4.0', author: 'team', updated: '2026-06-13', Component: Context },
  { id: 'ds', title: 'Design system — components', slot: 'Design system', version: '0.1.0', author: 'team', updated: '2026-06-13', Component: DesignSystem }
]
