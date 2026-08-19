function json(data, init = {}) {
  return new Response(JSON.stringify(data), { ...init, headers: { 'content-type': 'application/json; charset=utf-8', ...(init.headers || {}) } });
}

export async function onRequestPost({ env, request }) {
  if (!env.MEDIA) return json({ error: 'R2 media binding is not configured yet.' }, { status: 503 });
  if (!env.ADMIN_TOKEN || request.headers.get('authorization') !== `Bearer ${env.ADMIN_TOKEN}`) return json({ error: 'Unauthorized.' }, { status: 401 });
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return json({ error: 'file is required.' }, { status: 400 });
  if (!file.type.startsWith('image/')) return json({ error: 'Only image files are allowed.' }, { status: 415 });
  if (file.size > 5 * 1024 * 1024) return json({ error: 'Image must be 5MB or smaller.' }, { status: 413 });
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const key = `uploads/${Date.now()}-${safeName}`;
  await env.MEDIA.put(key, file.stream(), { httpMetadata: { contentType: file.type, cacheControl: 'public, max-age=31536000, immutable' } });
  return json({ key, size: file.size, contentType: file.type }, { status: 201 });
}
