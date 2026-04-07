import { list, put, del } from '@vercel/blob'

const token = process.env.BLOB_READ_WRITE_TOKEN

export async function blobList(prefix: string): Promise<{ pathname: string; url: string }[]> {
  const { blobs } = await list({ prefix, token })
  return blobs.filter(b => b.pathname.endsWith('.md'))
}

export async function blobGet(pathname: string): Promise<string | null> {
  const { blobs } = await list({ prefix: pathname, token })
  const blob = blobs.find(b => b.pathname === pathname)
  if (!blob) return null
  const res = await fetch(blob.url, { cache: 'no-store' })
  if (!res.ok) return null
  return res.text()
}

export async function blobPut(pathname: string, content: string): Promise<void> {
  await put(pathname, content, {
    access:            'public',
    addRandomSuffix:   false,
    token,
  })
}

export async function blobDel(pathname: string): Promise<void> {
  const { blobs } = await list({ prefix: pathname, token })
  const blob = blobs.find(b => b.pathname === pathname)
  if (blob) await del(blob.url, { token })
}
