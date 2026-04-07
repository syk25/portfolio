/**
 * One-time migration: uploads local markdown files to Vercel Blob.
 * By default, skips files that already exist in Blob (safe to re-run).
 * Pass --force to overwrite existing files.
 *
 * Usage:
 *   BLOB_READ_WRITE_TOKEN=your_token node scripts/seed-blob.mjs
 *   BLOB_READ_WRITE_TOKEN=your_token node scripts/seed-blob.mjs --force
 *
 * Or if you have it in .env.local:
 *   npx dotenv -e .env.local -- node scripts/seed-blob.mjs
 */

import fs from 'fs'
import path from 'path'
import { put, list } from '@vercel/blob'

const token = process.env.BLOB_READ_WRITE_TOKEN
if (!token) {
  console.error('Missing BLOB_READ_WRITE_TOKEN')
  process.exit(1)
}

const force = process.argv.includes('--force')
if (force) console.log('⚠️  --force: existing blobs will be overwritten.')

const root = path.resolve('.')

// Fetch all existing blob pathnames once
const { blobs: existing } = await list({ token })
const existingPaths = new Set(existing.map(b => b.pathname))

async function uploadFile(localPath, blobPath) {
  const full = path.join(root, localPath)
  if (!fs.existsSync(full)) {
    console.log(`  skip  ${blobPath} (local file not found)`)
    return
  }
  if (!force && existingPaths.has(blobPath)) {
    console.log(`  skip  ${blobPath} (already in Blob — use --force to overwrite)`)
    return
  }
  const content = fs.readFileSync(full, 'utf8')
  await put(blobPath, content, { access: 'private', addRandomSuffix: false, allowOverwrite: true, token })
  console.log(`  upload ${blobPath}`)
}

async function uploadDir(dir, prefix) {
  const fullDir = path.join(root, dir)
  if (!fs.existsSync(fullDir)) {
    console.log(`  skip  ${dir}/ (directory not found)`)
    return
  }
  const files = fs.readdirSync(fullDir).filter(f => f.endsWith('.md'))
  for (const file of files) {
    await uploadFile(path.join(dir, file), `${prefix}${file}`)
  }
}

console.log('Seeding Vercel Blob...')
await uploadDir('content/blog',     'blog/')
await uploadDir('content/projects', 'projects/')
await uploadFile('content/about.md', 'about.md')
console.log('Done.')
