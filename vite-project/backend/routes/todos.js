const express = require('express');
const router = express.Router();
const {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo
} = require('../controllers/todos');

// GET /api/todos
router.get('/', getAllTodos);

// POST /api/todos
router.post('/', createTodo);

// PUT /api/todos/:id
router.put('/:id', updateTodo);

// DELETE /api/todos/:id
router.delete('/:id', deleteTodo);

module.exports = router;