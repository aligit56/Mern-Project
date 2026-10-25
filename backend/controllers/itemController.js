const itemStore = require('../storage/itemStore')

const validateItemInput = (body) => {
  const errors = []
  const { title, price, description, category } = body

  if (typeof title !== 'string' || !title.trim()) {
    errors.push('Title is required')
  }
  if (typeof title === 'string' && title.trim().length > 120) {
    errors.push('Title cannot exceed 120 characters')
  }
  if (
    price === undefined ||
    price === null ||
    (typeof price === 'string' && price.trim() === '') ||
    (typeof price !== 'number' && typeof price !== 'string') ||
    !Number.isFinite(Number(price)) ||
    Number(price) < 0
  ) {
    errors.push('Price must be a valid non-negative number')
  }
  if (description !== undefined && typeof description !== 'string') {
    errors.push('Description must be a string')
  }
  if (typeof description === 'string' && description.length > 2000) {
    errors.push('Description cannot exceed 2000 characters')
  }
  if (category !== undefined && typeof category !== 'string') {
    errors.push('Category must be a string')
  }
  if (typeof category === 'string' && category.length > 80) {
    errors.push('Category cannot exceed 80 characters')
  }

  return errors
}

const validateId = (id) =>
  /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(id)

const getItems = async (req, res, next) => {
  try {
    const items = await itemStore.listItems()
    res.status(200).json(items)
  } catch (error) {
    next(error)
  }
}

const getItemById = async (req, res, next) => {
  try {
    if (!validateId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid item ID' })
    }

    const item = await itemStore.findItemById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Item not found' })
    }

    return res.status(200).json(item)
  } catch (error) {
    return next(error)
  }
}

const createItem = async (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({ message: 'Request body must be a JSON object' })
    }

    const errors = validateItemInput(req.body)
    if (errors.length) {
      return res.status(400).json({ message: errors[0], errors })
    }

    const item = await itemStore.createItem({
      title: req.body.title.trim(),
      description: req.body.description?.trim() || '',
      price: Number(req.body.price),
      category: req.body.category?.trim() || '',
    })

    return res.status(201).json(item)
  } catch (error) {
    return next(error)
  }
}

const updateItem = async (req, res, next) => {
  try {
    if (!validateId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid item ID' })
    }
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({ message: 'Request body must be a JSON object' })
    }

    const errors = validateItemInput(req.body)
    if (errors.length) {
      return res.status(400).json({ message: errors[0], errors })
    }

    const item = await itemStore.updateItem(
      req.params.id,
      {
        title: req.body.title.trim(),
        description: req.body.description?.trim() || '',
        price: Number(req.body.price),
        category: req.body.category?.trim() || '',
      },
    )

    if (!item) {
      return res.status(404).json({ message: 'Item not found' })
    }

    return res.status(200).json(item)
  } catch (error) {
    return next(error)
  }
}

const deleteItem = async (req, res, next) => {
  try {
    if (!validateId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid item ID' })
    }

    const item = await itemStore.deleteItem(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Item not found' })
    }

    return res.status(200).json({ message: 'Item deleted successfully', id: item._id })
  } catch (error) {
    return next(error)
  }
}

module.exports = { getItems, getItemById, createItem, updateItem, deleteItem }
