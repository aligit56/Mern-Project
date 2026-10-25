const { randomUUID } = require('node:crypto')
const fs = require('node:fs/promises')
const path = require('node:path')

const dataFile = process.env.ITEMS_FILE_PATH
  ? path.resolve(process.env.ITEMS_FILE_PATH)
  : path.join(__dirname, '..', 'data', 'items.json')
const dataDirectory = path.dirname(dataFile)
let operationQueue = Promise.resolve()

const withStoreLock = (operation) => {
  const result = operationQueue.then(operation, operation)
  operationQueue = result.then(
    () => undefined,
    () => undefined,
  )
  return result
}

const writeItems = async (items) => {
  await fs.mkdir(dataDirectory, { recursive: true })
  const temporaryFile = `${dataFile}.${randomUUID()}.tmp`
  await fs.writeFile(temporaryFile, `${JSON.stringify(items, null, 2)}\n`, 'utf8')
  await fs.rename(temporaryFile, dataFile)
}

const readItems = async () => {
  await fs.mkdir(dataDirectory, { recursive: true })

  try {
    const content = await fs.readFile(dataFile, 'utf8')
    const items = JSON.parse(content)
    if (!Array.isArray(items)) {
      throw new Error('Item data file must contain a JSON array')
    }
    return items
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error
    }
    await writeItems([])
    return []
  }
}

const listItems = () =>
  withStoreLock(async () => {
    const items = await readItems()
    return items.sort((first, second) => second.createdAt.localeCompare(first.createdAt))
  })

const findItemById = (id) =>
  withStoreLock(async () => {
    const items = await readItems()
    return items.find((item) => item._id === id) || null
  })

const createItem = (values) =>
  withStoreLock(async () => {
    const items = await readItems()
    const now = new Date().toISOString()
    const item = { _id: randomUUID(), ...values, createdAt: now, updatedAt: now }
    items.push(item)
    await writeItems(items)
    return item
  })

const updateItem = (id, values) =>
  withStoreLock(async () => {
    const items = await readItems()
    const index = items.findIndex((item) => item._id === id)
    if (index === -1) {
      return null
    }

    const item = { ...items[index], ...values, updatedAt: new Date().toISOString() }
    items[index] = item
    await writeItems(items)
    return item
  })

const deleteItem = (id) =>
  withStoreLock(async () => {
    const items = await readItems()
    const index = items.findIndex((item) => item._id === id)
    if (index === -1) {
      return null
    }

    const [item] = items.splice(index, 1)
    await writeItems(items)
    return item
  })

module.exports = { listItems, findItemById, createItem, updateItem, deleteItem }
