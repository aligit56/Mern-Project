import { handleError, isValidId, json, toItem, validateItem } from '../../_utils.js'

const selectItem = (database, id) =>
  database
    .prepare(
      `SELECT id, title, description, price, category, created_at, updated_at
       FROM items
       WHERE id = ?`,
    )
    .bind(id)
    .first()

export async function onRequestGet({ params, env }) {
  if (!isValidId(params.id)) {
    return json({ message: 'Invalid item ID' }, 400)
  }

  try {
    const item = await selectItem(env.DB, params.id)
    return item ? json(toItem(item)) : json({ message: 'Item not found' }, 404)
  } catch (error) {
    return handleError(error)
  }
}

export async function onRequestPut({ params, request, env }) {
  if (!isValidId(params.id)) {
    return json({ message: 'Invalid item ID' }, 400)
  }

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

  try {
    const existingItem = await selectItem(env.DB, params.id)
    if (!existingItem) {
      return json({ message: 'Item not found' }, 404)
    }

    const { title, description, price, category } = validation.value
    const updatedAt = new Date().toISOString()
    await env.DB.prepare(
      `UPDATE items
       SET title = ?, description = ?, price = ?, category = ?, updated_at = ?
       WHERE id = ?`,
    )
      .bind(title, description, price, category, updatedAt, params.id)
      .run()

    return json({
      _id: params.id,
      title,
      description,
      price,
      category,
      createdAt: existingItem.created_at,
      updatedAt,
    })
  } catch (error) {
    return handleError(error)
  }
}

export async function onRequestDelete({ params, env }) {
  if (!isValidId(params.id)) {
    return json({ message: 'Invalid item ID' }, 400)
  }

  try {
    const item = await selectItem(env.DB, params.id)
    if (!item) {
      return json({ message: 'Item not found' }, 404)
    }

    await env.DB.prepare('DELETE FROM items WHERE id = ?').bind(params.id).run()
    return json({ message: 'Item deleted successfully', id: params.id })
  } catch (error) {
    return handleError(error)
  }
}
