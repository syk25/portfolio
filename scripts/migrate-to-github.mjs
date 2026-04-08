/**
 * One-time migration: uploads local content/ files to the GitHub content branch.
 * Safe to re-run — skips files that already exist unless --force is passed.
 *
 * Usage:
 *   GITHUB_TOKEN=ghp_... GITHUB_OWNER=syk25 GITHUB_REPO=portfolio \
 *     node scripts/migrate-to-github.mjs
 *
 *   # overwrite existing files:
 *   ... node scripts/migrate-to-github.mjs --force
 *
 * Or with .env.local:
 *   npx dotenv -e .env.local -- node scripts/migrate-to-github.mjs
 */

import fs   from 'fs'
import path from 'path'

const TOKEN  = process.env.GITHUB_TOKEN
const OWNER  = process.env.GITHUB_OWNER
const REPO   = process.env.GITHUB_REPO
const BRANCH = process.env.GITHUB_CONTENT_BRANCH ?? 'content'
const FORCE  = process.argv.includes('--force')

if (!TOKEN || !OWNER || !REPO) {
  console.error('Missing GITHUB_TOKEN, GITHUB_OWNER, or GITHUB_REPO')
  process.exit(1)
}

const API = `https://api.github.com/repos/${OWNER}/${REPO}/contents`
const HEADERS = {
  Authorization:          `Bearer ${TOKEN}`,
  Accept:                 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type':         'application/json',
}

async function getSha(ghPath) {
  const res = await fetch(`${API}/${ghPath}?ref=${BRANCH}`, { headers: HEADERS })
  if (!res.ok) return null
  const data = await res.json()
  return data.sha ?? null
}

async function uploadFile(localPath, ghPath) {
  const full = path.resolve(localPath)
  if (!fs.existsSync(full)) {
    console.log(`  skip   ${ghPath} (local file not found)`)
    return
  }

  const sha = await getSha(ghPath)
  if (sha && !FORCE) {
    console.log(`  skip   ${ghPath} (already exists — use --force to overwrite)`)
    return
  }

  const content = fs.readFileSync(full, 'utf-8')
  const body = {
    message: `migrate: ${ghPath}`,
    content: Buffer.from(content, 'utf-8').toString('base64'),
    branch:  BRANCH,
  }
  if (sha) body.sha = sha

  const res = await fetch(`${API}/${ghPath}`, {
    method:  'PUT',
    headers: HEADERS,
    body:    JSON.stringify(body),
  })
  if (res.ok) {
    console.log(`  upload ${ghPath}`)
  } else {
    console.error(`  ERROR  ${ghPath}: ${res.status} ${await res.text()}`)
  }
}

async function uploadDir(localDir, ghPrefix) {
  const full = path.resolve(localDir)
  if (!fs.existsSync(full)) {
    console.log(`  skip   ${localDir}/ (directory not found)`)
    return
  }
  const files = fs.readdirSync(full).filter(f => f.endsWith('.md'))
  for (const file of files) {
    await uploadFile(path.join(localDir, file), `${ghPrefix}${file}`)
  }
}

console.log(`Migrating content to GitHub (${OWNER}/${REPO}@${BRANCH})...`)
if (FORCE) console.log('  --force: existing files will be overwritten')

await uploadDir('content/blog',     'blog/')
await uploadDir('content/projects', 'projects/')
await uploadFile('content/about.md', 'about.md')
console.log('Done.')
