const mongoose = require("mongoose");
const todosSchema = new mongoose.Schema({
  todo: {
    type: String,
    required: [true, "Write your todos"],
    lowercase: true,
  },

  description: {
    type: String,
    required: [true, "Write todos description"],
    lowercase: true,
    trim: true,
    minLength: [8, "Description must be of 8 character in length"],
  },

  category: {
    type: String,
    enum: ["Busisness", "Personal", "Important", "Other"],
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Complete", "InProgress"],
  },
  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
});

module.exports = mongoose.model("Todos", todosSchema);
