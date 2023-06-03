const express = require("express");
const router = express.Router();

const {
  getAllTodos,
  createTodo,
  removeTodo,
  updateTodo,
  searchTodos,
  reminderTodo,
  editDescriptionTodo,
  editTitleTodo,
  updateTodoStatus
} = require("../controllers/todoController");
const { isAuthenticated } = require("../utils/auth");

router.route("/all-todos").get(isAuthenticated, getAllTodos);
router.route("/new-todo").post(isAuthenticated, createTodo);
router.route("/remove-todo/:id").delete(isAuthenticated, removeTodo);
router.route("/update-todo/:id").put(isAuthenticated, updateTodo);

router.route("/search").get(isAuthenticated, searchTodos);

router.route("/reminder/:id").post(isAuthenticated, reminderTodo);

router.route("/edit-description/:id").put(isAuthenticated, editDescriptionTodo);
router.route("/edit-title/:id").put(isAuthenticated, editTitleTodo);
router.route("/update-status/:id").put(isAuthenticated, updateTodoStatus);

module.exports = router;
