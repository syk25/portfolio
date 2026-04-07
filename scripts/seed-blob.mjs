/**
 * One-time migration: uploads existing markdown files to Vercel Blob.
 *
 * Usage:
 *   BLOB_READ_WRITE_TOKEN=your_token node scripts/seed-blob.mjs
 *
 * Or if you have it in .env.local:
 *   npx dotenv -e .env.local -- node scripts/seed-blob.mjs
 */

import fs from 'fs'
import path from 'path'
import { put } from '@vercel/blob'

const token = process.env.BLOB_READ_WRITE_TOKEN
if (!token) {
  console.error('Missing BLOB_READ_WRITE_TOKEN')
  process.exit(1)
}

const root = path.resolve('.')

async function uploadDir(dir, prefix) {
  const fullDir = path.join(root, dir)
  if (!fs.existsSync(fullDir)) {
    console.log(`  skipping ${dir} (not found)`)
    return
  }
  const files = fs.readdirSync(fullDir).filter(f => f.endsWith('.md'))
  for (const file of files) {
    const content = fs.readFileSync(path.join(fullDir, file), 'utf8')
    const blobPath = `${prefix}${file}`
      await put(blobPath, content, { access: 'private', addRandomSuffix: false, token })
    console.log(`  uploaded ${blobPath}`)
  }
}

async function uploadFile(filePath, blobPath) {
  const full = path.join(root, filePath)
  if (!fs.existsSync(full)) {
    console.log(`  skipping ${filePath} (not found)`)
    return
  }
  const content = fs.readFileSync(full, 'utf8')
  await put(blobPath, content, { access: 'private', addRandomSuffix: false, token })
  console.log(`  uploaded ${blobPath}`)
}

console.log('Seeding Vercel Blob...')
await uploadDir('content/blog',     'blog/')
await uploadDir('content/projects', 'projects/')
await uploadFile('content/about.md', 'about.md')
console.log('Done.')
