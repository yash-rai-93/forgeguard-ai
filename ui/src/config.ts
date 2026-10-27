// Build-time mode switch. `VITE_STATIC_DEMO=1 npm run build` produces the
// GitHub Pages build: no API, no WebSocket -- incidents, KPIs and camera
// recordings all come from the files under public/showcase/.
export const STATIC_DEMO = import.meta.env.VITE_STATIC_DEMO === '1'

export const PROJECT_NAME = 'ForgeGuard AI'
export const MAINTAINER_NAME = 'Yash'
export const MAINTAINER_EMAIL = 'yashrai4426@gmail.com'
export const PROFILE_URL = 'https://github.com/yash-rai-93'
export const REPO_URL = 'https://github.com/yash-rai-93/forgeguard-ai'
export const SITE_URL = 'https://yash-rai-93.github.io/forgeguard-ai/'

/** URL for a file under public/, respecting the configured GitHub Pages base path. */
export function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
