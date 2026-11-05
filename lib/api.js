const BASE = '/api/server';

async function refreshToken() {
  try {
    const res = await fetch('/api/token', { method: 'POST', credentials: 'include' });
    return res.ok;
  } catch (e) {
    return false;
  }
}

// Fetch wrapper for the Express API. Sends the HTTPOnly JWT cookie automatically and,
// if the cookie is missing/expired but the BetterAuth session is alive, re-issues it once.
export async function api(path, { method = 'GET', body, retry = true } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    credentials: 'include',
    cache: 'no-store',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401 && retry && (await refreshToken())) {
    return api(path, { method, body, retry: false });
  }
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    /* empty body */
  }
  if (!res.ok) {
    const err = new Error(data?.message || 'Something went wrong. Please try again.');
    err.status = res.status;
    throw err;
  }
  return data;
}

// imgbb image hosting (https://api.imgbb.com) - key lives in NEXT_PUBLIC_IMGBB_KEY
export async function uploadToImgbb(file) {
  const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!key) throw new Error('Image upload is not configured. Paste an image URL instead.');
  const form = new FormData();
  form.append('image', file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: 'POST', body: form });
  const json = await res.json();
  if (!res.ok || !json?.data?.url) throw new Error('The image could not be uploaded. Please try another file.');
  return json.data.url;
}
