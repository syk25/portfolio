/**
 * Content storage via GitHub Contents API.
 * Drop-in replacement for the old @vercel/blob implementation —
 * all function signatures are identical so no other file needs to change.
 *
 * Required env vars:
 *   GITHUB_TOKEN           Personal Access Token (contents: write)
 *   GITHUB_OWNER           Repo owner username  (e.g. "syk25")
 *   GITHUB_REPO            Repo name            (e.g. "portfolio")
 *   GITHUB_CONTENT_BRANCH  Branch for content   (default: "content")
 */

const TOKEN  = process.env.GITHUB_TOKEN
const OWNER  = process.env.GITHUB_OWNER
const REPO   = process.env.GITHUB_REPO
const BRANCH = process.env.GITHUB_CONTENT_BRANCH ?? 'content'

const API = `https://api.github.com/repos/${OWNER}/${REPO}/contents`

function ghHeaders(): HeadersInit {
  return {
    Authorization:           `Bearer ${TOKEN}`,
    Accept:                  'application/vnd.github+json',
    'X-GitHub-Api-Version':  '2022-11-28',
  }
}

interface GHEntry {
  type:     string
  name:     string
  path:     string
  sha:      string
  content?: string   // base64, only present on single-file responses
}

/** Fetch a single file's metadata + content from GitHub. */
async function ghEntry(pathname: string): Promise<GHEntry | null> {
  const res = await fetch(`${API}/${pathname}?ref=${BRANCH}`, {
    headers: ghHeaders(),
    cache:   'no-store',
  })
  if (!res.ok) return null
  return res.json() as Promise<GHEntry>
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * List files in a directory.
 * `url` is set to `pathname` so that blobFetch(url) works unchanged.
 */
export async function blobList(prefix: string): Promise<{ pathname: string; url: string }[]> {
  const dir = prefix.replace(/\/$/, '')
  const res = await fetch(`${API}/${dir}?ref=${BRANCH}`, {
    headers: ghHeaders(),
    cache:   'no-store',
  })
  if (!res.ok) return []
  const entries: GHEntry[] = await res.json()
  return entries
    .filter(e => e.type === 'file' && e.name.endsWith('.md'))
    .map(e => ({ pathname: e.path, url: e.path }))
}

/** Read a file by pathname. Returns null if not found. */
export async function blobGet(pathname: string): Promise<string | null> {
  const entry = await ghEntry(pathname)
  if (!entry?.content) return null
  return Buffer.from(entry.content, 'base64').toString('utf-8')
}

/**
 * Fetch file content by URL.
 * With this GitHub backend, `url` is the pathname (as returned by blobList).
 */
export async function blobFetch(url: string): Promise<string> {
  return (await blobGet(url)) ?? ''
}

/** Create or update a file. Automatically fetches the current SHA for updates. */
export async function blobPut(pathname: string, content: string): Promise<void> {
  const existing = await ghEntry(pathname)
  const body: Record<string, unknown> = {
    message: `content: update ${pathname}`,
    content: Buffer.from(content, 'utf-8').toString('base64'),
    branch:  BRANCH,
  }
  if (existing?.sha) body.sha = existing.sha

  const res = await fetch(`${API}/${pathname}`, {
    method:  'PUT',
    headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GitHub API ${res.status}: ${text}`)
  }
}

/** Delete a file by pathname. No-ops if the file doesn't exist. */
export async function blobDel(pathname: string): Promise<void> {
  const existing = await ghEntry(pathname)
  if (!existing?.sha) return

  const res = await fetch(`${API}/${pathname}`, {
    method:  'DELETE',
    headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      message: `content: delete ${pathname}`,
      sha:     existing.sha,
      branch:  BRANCH,
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GitHub API ${res.status}: ${text}`)
  }
}
