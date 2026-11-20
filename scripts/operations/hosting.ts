/** Where this app is hosted. docs/operations/hosting.md describes each piece. */
export const HOSTING = {
  cloudflareAccountId: '431a529079f2d76802b95056e39950f0',
  /** The `adrienlcp.com` zone, home of every personal app. */
  cloudflareZoneId: '7287a21bea71667f9344cb4f80087729',
  githubRepository: 'AdrienLcp/sport',
  /** The private build, deployed from this machine only. */
  netlifySite: 'seance-adrien',
  pagesProject: 'sport',
  publicDomain: 'sport.adrienlcp.com'
} as const
