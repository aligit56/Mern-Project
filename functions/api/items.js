import { handleError, json, toItem, validateItem } from '../_utils.js'

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(
      `SELECT id, title, description, price, category, created_at, updated_at
       FROM items
       ORDER BY created_at DESC`,
    ).all()

    return json(results.map(toItem))
  } catch (error) {
    return handleError(error)
  }
}

export async function onRequestPost({ request, env }) {
  let body
  try {
    body = await request.json()
  } catch {
    return json({ message: 'Request body contains invalid JSON' }, 400)
  }

  const validation = validateItem(body)
  if (validation.errors) {
    return json({ message: validation.errors[0], errors: validation.errors }, 400)
  }

  const id = crypto.randomUUID()
  const now = new Date().toISOString()
  const { title, description, price, category } = validation.value

  try {
    await env.DB.prepare(
      `INSERT INTO items (id, title, description, price, category, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(id, title, description, price, category, now, now)
      .run()

    return json(
      { _id: id, title, description, price, category, createdAt: now, updatedAt: now },
      201,
    )
  } catch (error) {
    return handleError(error)
  }
}
