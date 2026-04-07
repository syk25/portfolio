/**
 * Pulls current content from Vercel Blob to local content/ directory.
 * Overwrites local files with whatever is live in Blob.
 *
 * Usage:
 *   node --env-file=.env.local scripts/pull-blob.mjs
 */

import fs from 'fs'
import path from 'path'
import { list } from '@vercel/blob'

const token = process.env.BLOB_READ_WRITE_TOKEN
if (!token) {
  console.error('Missing BLOB_READ_WRITE_TOKEN')
  process.exit(1)
}

const root = path.resolve('.')

async function pullDir(prefix, localDir) {
  const { blobs } = await list({ prefix, token })
  const mdBlobs = blobs.filter(b => b.pathname.endsWith('.md'))

  fs.mkdirSync(path.join(root, localDir), { recursive: true })

  for (const blob of mdBlobs) {
    const res = await fetch(blob.url, { headers: { Authorization: `Bearer ${token}` } })
    const content = await res.text()
    const filename = blob.pathname.replace(prefix, '')
    const localPath = path.join(root, localDir, filename)
    fs.writeFileSync(localPath, content, 'utf8')
    console.log(`  pulled ${blob.pathname} → ${localDir}/${filename}`)
  }
}

async function pullFile(blobPathname, localPath) {
  const { blobs } = await list({ prefix: blobPathname, token })
  const blob = blobs.find(b => b.pathname === blobPathname)
  if (!blob) {
    console.log(`  skipping ${blobPathname} (not found in Blob)`)
    return
  }
  const res = await fetch(blob.url, { headers: { Authorization: `Bearer ${token}` } })
  const content = await res.text()
  fs.mkdirSync(path.dirname(path.join(root, localPath)), { recursive: true })
  fs.writeFileSync(path.join(root, localPath), content, 'utf8')
  console.log(`  pulled ${blobPathname} → ${localPath}`)
}

console.log('Pulling from Vercel Blob...')
await pullDir('blog/',     'content/blog')
await pullDir('projects/', 'content/projects')
await pullFile('about.md', 'content/about.md')
console.log('Done.')
