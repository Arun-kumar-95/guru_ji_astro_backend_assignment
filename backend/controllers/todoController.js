// require path module
const path = require("path");

//******************* * REQUIRING THE SCHEMAS   ***********************//

const userSchema = require(path.join(process.cwd(), "./backend/models/User"));
const todoSchema = require(path.join(process.cwd(), "./backend/models/Todo"));

// ERROR HANDLER
const { ErrorHandler } = require(path.join(
  process.cwd(),
  "./backend/utils/errorHandler"
));

// MESSAGE HANDLER
const SuccessMessage = require(path.join(
  process.cwd(),
  "./backend/utils/message"
));

// CATCH ASYNC MIDDLEWARE
const { CatchAsyncError } = require(path.join(
  process.cwd(),
  "./backend/middlewares/CatchAsyncError"
));

const ApiFeatures = require(path.join(
  process.cwd(),
  "./backend/utils/apiFeatures"
));

const { SendMail } = require(path.join(
  process.cwd(),
  "./backend/utils/sendMail"
));

// ***** CREATE TODO ****//
module.exports.createTodo = CatchAsyncError(async (req, res, next) => {
  const { todo, description, category, status } = req.body;

  // find the user

  let user = await userSchema.findById({ _id: req.user._id });
  if (!user) {
    return next(new ErrorHandler(404, "User doesnot exists"));
  }

  // if user exists then create a todo
  let todoItem = await todoSchema.create({
    todo,
    description,
    status,
    category,
    user: user._id,
  });

  await todoItem.save();
  user.todos.push(todoItem._id);
  await user.save();

  return SuccessMessage(201, "Todo Created", res);
});

// ***** DELETE TODO ****//

module.exports.removeTodo = CatchAsyncError(async (req, res, next) => {
  // find the user
  let user = await userSchema.findById({ _id: req.user._id });
  if (!user) {
    return next(new ErrorHandler(404, "User doesnot exists"));
  }

  let todo = await todoSchema.findById({ _id: req.params.id });
  if (todo) {
    if (user.todos.includes(req.params.id)) {
      user.todos.splice(user.todos.indexOf(req.params.id), 1);
    }
    await user.save();
    await todoSchema.findByIdAndDelete(req.params.id);
    return SuccessMessage(200, "Todo Removed", res);
  }
});

module.exports.updateTodo = CatchAsyncError(async (req, res, next) => {
  const { todo, status, category, description } = req.body;
  let todoItem = await todoSchema.findById(req.params.id);
  if (!todoItem) {
    return next(new ErrorHandler(404, "Invalid todo item"));
  }

  await todoSchema.updateOne(
    { _id: req.params.id },
    {
      $set: {
        todo,
        description,
        category,
        status,
      },
    },
    {
      new: true,
      runvalidator: true,
      upsert: true,
    }
  );
  return SuccessMessage(200, "Todo Item updated", res);
});

// ***** GET ALL TODO ****//

module.exports.getAllTodos = CatchAsyncError(async (req, res, next) => {
  const resultPerPage = 8;
  const totalTodos = await todoSchema.countDocuments();
  const apiFeature = new ApiFeatures(todoSchema.find(), req.query)
    .filter()
    .pagination(resultPerPage);

  const todos = await apiFeature.query;
  return res.status(200).json({
    totalTodos,
    status: {
      success: true,
      searchTodoCount: todos.length,
    },
    todos,
  });
});

// *** SEARCH todos ****//

module.exports.searchTodos = CatchAsyncError(async (req, res, next) => {
  const resultPerPage = 8;
  const totalTodos = await todoSchema.countDocuments();
  const apiFeature = new ApiFeatures(todoSchema.find(), req.query)
    .search()
    .pagination(resultPerPage);

  const todos = await apiFeature.query;
  return res.status(200).json({
    totalTodos,
    status: {
      success: true,
      searchTodoCount: todos.length,
    },
    todos,
  });
});

// *****  REMAINER TODOS WITH EMAIL    ******///

module.exports.reminderTodo = CatchAsyncError(async (req, res, next) => {
  let todoItem = await todoSchema.findById(req.params.id);
  let user = await userSchema.findById(req.user._id);
  if (todoItem) {
    const mailMessage = `Remainder for: ${todoItem.todo} \n\nPLEASE COMPLETE THE TASK NOW !`;
    try {
      const remainderTime = req.body.time * (1000 * 60);
      async function reminderCall() {
        await SendMail({
          email: user.email,
          subject: "Todo Remainder",
          mailMessage,
        });
      }

      setTimeout(reminderCall, remainderTime);
      return SuccessMessage(200, `Remainder set for ${todoItem.todo}`, res);
    } catch (err) {
      return next(new ErrorHandler(500, err.message));
    }
  }
});

// ******    EDIT DESCRIPTION ONLY       *******//

module.exports.editDescriptionTodo = CatchAsyncError(async (req, res, next) => {
  
  await todoSchema.findOneAndUpdate(
    { _id: req.params.id },
    {
      description: req.body.description,
    },
    {
      new: true,
      runvalidator: true,
      upsert: true, 
    }
  );

  return SuccessMessage(200, "Description updated", res);
});

// ******    EDIT TITLE ONLY       *******//

module.exports.editTitleTodo = CatchAsyncError(async (req, res, next) => {
  await todoSchema.findOneAndUpdate(
    { _id: req.params.id },
    {
      todo: req.body.title,
    },
    {
      new: true,
      runvalidator: true,
      upsert: true, 
    }
  );

  return SuccessMessage(200, "Title updated", res);
});

// ******    CHANGED STATUS ONLY       *******//

module.exports.updateTodoStatus = CatchAsyncError(async (req, res, next) => {
  await todoSchema.findOneAndUpdate(
    { _id: req.params.id },
    {
      status: req.body.status,
    },
    {
      new: true,
      runvalidator: true,
      upsert: true,
    }
  );

  return SuccessMessage(200, "Status Changed", res);
});
