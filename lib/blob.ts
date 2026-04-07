import { list, put, del } from '@vercel/blob'

const token = process.env.BLOB_READ_WRITE_TOKEN

// Private blobs require the token in the Authorization header when fetching
async function fetchBlob(url: string): Promise<string> {
  const res = await fetch(url, {
    cache:   'no-store',
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.text()
}

export async function blobList(prefix: string): Promise<{ pathname: string; url: string }[]> {
  const { blobs } = await list({ prefix, token })
  return blobs.filter(b => b.pathname.endsWith('.md'))
}

export async function blobGet(pathname: string): Promise<string | null> {
  const { blobs } = await list({ prefix: pathname, token })
  const blob = blobs.find(b => b.pathname === pathname)
  if (!blob) return null
  return fetchBlob(blob.url)
}

export async function blobFetch(url: string): Promise<string> {
  return fetchBlob(url)
}

export async function blobPut(pathname: string, content: string): Promise<void> {
  await put(pathname, content, {
    access:          'private',
    addRandomSuffix: false,
    allowOverwrite:  true,
    token,
  })
}

export async function blobDel(pathname: string): Promise<void> {
  const { blobs } = await list({ prefix: pathname, token })
  const blob = blobs.find(b => b.pathname === pathname)
  if (blob) await del(blob.url, { token })
}
