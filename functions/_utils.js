export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })

export const validateItem = (body) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { errors: ['Request body must be a JSON object'] }
  }

  const errors = []
  const { title, description, category } = body
  const price =
    typeof body.price === 'number' || typeof body.price === 'string'
      ? Number(body.price)
      : Number.NaN

  if (typeof title !== 'string' || !title.trim()) {
    errors.push('Title is required')
  } else if (title.trim().length > 120) {
    errors.push('Title cannot exceed 120 characters')
  }

  if (
    body.price === undefined ||
    (typeof body.price === 'string' && !body.price.trim()) ||
    !Number.isFinite(price) ||
    price < 0
  ) {
    errors.push('Price must be a valid non-negative number')
  }

  if (description !== undefined && typeof description !== 'string') {
    errors.push('Description must be a string')
  } else if (typeof description === 'string' && description.length > 2000) {
    errors.push('Description cannot exceed 2000 characters')
  }

  if (category !== undefined && typeof category !== 'string') {
    errors.push('Category must be a string')
  } else if (typeof category === 'string' && category.length > 80) {
    errors.push('Category cannot exceed 80 characters')
  }

  if (errors.length) {
    return { errors }
  }

  return {
    value: {
      title: title.trim(),
      description: description?.trim() || '',
      price,
      category: category?.trim() || '',
    },
  }
}

export const isValidId = (id) =>
  /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(id)

export const handleError = (error) => {
  console.error('Items API error:', error)
  return json({ message: 'An unexpected server error occurred' }, 500)
}

export const toItem = (row) => ({
  _id: row.id,
  title: row.title,
  description: row.description,
  price: row.price,
  category: row.category,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})
