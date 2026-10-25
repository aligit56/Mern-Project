const express = require('express')
const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/itemController')

const router = express.Router()

router.route('/').get(getItems).post(createItem)
router.route('/:id').get(getItemById).put(updateItem).delete(deleteItem)

module.exports = router
