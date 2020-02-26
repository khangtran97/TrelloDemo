const express = require('express');
const checkAuth = require('../middleware/check-auth');
const CategoryController = require('../controllers/category');

const router = express.Router();


router.get('', CategoryController.getCategories);

router.post('', CategoryController.createCategory);

router.delete('/:id', CategoryController.deleteCategory);

router.put('/:id', checkAuth, CategoryController.editCategory);

module.exports = router;