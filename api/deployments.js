// Vercel serverless function — returns real deployment history for the project.
// The token stays server-side (never shipped to the browser).
// Setup: add VERCEL_TOKEN in Vercel → Project → Settings → Environment Variables, then redeploy.

const PROJECT = 'prj_zRJKfs30gmyG9k8sYa21Xc6evVbE'
const TEAM = 'team_MEVV8rQ5spg1OuywYgmwSqWO'

export default async function handler(req, res) {
  const token = process.env.VERCEL_TOKEN
  if (!token) {
    res.status(200).json({ error: 'Set VERCEL_TOKEN in Vercel → Settings → Environment Variables, then redeploy.' })
    return
  }
  try {
    const r = await fetch(
      `https://api.vercel.com/v6/deployments?projectId=${PROJECT}&teamId=${TEAM}&limit=100`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (!r.ok) { res.status(200).json({ error: 'Vercel API ' + r.status }); return }
    const data = await r.json()
    const rows = (data.deployments || [])
      .filter(d => (d.state || d.readyState) === 'READY' && d.url)
      .map(d => ({
        name: d.meta?.githubCommitRef || d.name,
        author: d.meta?.githubCommitAuthorName || d.creator?.username || 'unknown',
        date: d.created || d.createdAt,
        url: 'https://' + d.url,
        msg: (d.meta?.githubCommitMessage || '').split('\n')[0],
        sha: (d.meta?.githubCommitSha || '').slice(0, 7),
        target: d.target
      }))
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=120')
    res.status(200).json({ rows })
  } catch (e) {
    res.status(200).json({ error: String(e && e.message || e) })
  }
}
