import { decodeBuild, encodeBuild } from '#shared/utils/shareBuild'

// Bridges the build store <-> a shareable URL (?b=<token>). Encodes only build
// config (see shareBuild.ts) — no personal data.
export function useShareBuild() {
  const build = useBuildStore()
  const route = useRoute()
  const router = useRouter()
  const { copy, copied, isSupported } = useClipboard()

  /** If the current URL carries a build token, load it and strip the query. */
  function applySharedFromRoute(): boolean {
    const token = route.query.b
    if (typeof token !== 'string' || token.length === 0) return false

    const config = decodeBuild(token)
    if (!config) return false

    build.applyConfig(config)
    // Remove the token so the address bar reflects the live (now editable) build.
    router.replace({ query: {} })
    return true
  }

  /** Absolute, shareable URL for the current build. */
  function buildShareUrl(): string {
    const token = encodeBuild(build.snapshot())
    const origin = import.meta.client ? window.location.origin : ''
    return `${origin}${route.path}?b=${token}`
  }

  async function copyShareLink(): Promise<string> {
    const url = buildShareUrl()
    if (isSupported.value) await copy(url)
    return url
  }

  return { applySharedFromRoute, buildShareUrl, copyShareLink, copied, clipboardSupported: isSupported }
}
