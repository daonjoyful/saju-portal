function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(init.headers || {}) }
  });
}

export async function onRequestGet({ env, request }) {
  if (!env.DB) return json({ error: 'D1 database is not configured yet.', posts: [] }, { status: 503 });
  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const search = url.searchParams.get('search');
  const params = [];
  const where = ["p.status = 'published'"];
  if (category && category !== 'all') { where.push('p.category_id = ?'); params.push(category); }
  if (search) { where.push('(p.title LIKE ? OR p.excerpt LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
  const result = await env.DB.prepare(`SELECT p.*, c.name AS category_name FROM posts p LEFT JOIN categories c ON c.id = p.category_id WHERE ${where.join(' AND ')} ORDER BY COALESCE(p.published_at, p.created_at) DESC`).bind(...params).all();
  return json(result.results);
}

export async function onRequestPost({ env, request }) {
  if (!env.DB) return json({ error: 'D1 database is not configured yet.' }, { status: 503 });
  if (!env.ADMIN_TOKEN) return json({ error: 'Admin token is not configured yet.' }, { status: 503 });
  if (request.headers.get('authorization') !== `Bearer ${env.ADMIN_TOKEN}`) return json({ error: 'Unauthorized.' }, { status: 401 });
  const body = await request.json();
  if (!body.title || !body.category_id || !body.body) return json({ error: 'title, category_id and body are required.' }, { status: 400 });
  const result = await env.DB.prepare('INSERT INTO posts(category_id,title,excerpt,body,image_url,status,published_at) VALUES(?,?,?,?,?,?,?)').bind(body.category_id, body.title, body.excerpt || '', body.body, body.image_url || null, body.status || 'draft', body.status === 'published' ? new Date().toISOString() : null).run();
  return json({ id: result.meta.last_row_id }, { status: 201 });
}

export async function onRequestDelete({ env, request }) {
  if (!env.DB) return json({ error: 'D1 database is not configured yet.' }, { status: 503 });
  if (!env.ADMIN_TOKEN || request.headers.get('authorization') !== `Bearer ${env.ADMIN_TOKEN}`) return json({ error: 'Unauthorized.' }, { status: 401 });
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return json({ error: 'id is required.' }, { status: 400 });
  await env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();
  return json({ ok: true });
}

export async function onRequestPut({ env, request }) {
  if (!env.DB) return json({ error: 'D1 database is not configured yet.' }, { status: 503 });
  if (!env.ADMIN_TOKEN || request.headers.get('authorization') !== `Bearer ${env.ADMIN_TOKEN}`) return json({ error: 'Unauthorized.' }, { status: 401 });
  const id = new URL(request.url).searchParams.get('id');
  const body = await request.json();
  if (!id || !body.title || !body.body) return json({ error: 'id, title and body are required.' }, { status: 400 });
  await env.DB.prepare('UPDATE posts SET title = ?, excerpt = ?, body = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(body.title, body.excerpt || '', body.body, id).run();
  return json({ ok: true });
}
