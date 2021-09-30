const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Todo = require("./models/todo");
const todo = require("./models/todo");

//====== mogoose
mongoose.connect("mongodb://localhost/todo-demo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hi!");
});

//====== 할일 목록 불러오기
router.get("/todos", async (req, res) => {
  const todos = await Todo.find().sort("-order").exec();
  res.send({ todos })
});


//====== 할일 목록 추가 (schema에서 value)
router.post("/todos", async (req, res) => {
  const { value } = req.body;
  const maxOrderTodo = await Todo.findOne().sort("-order").exec();

  const order = maxOrderTodo ? maxOrderTodo.order + 1 : 1;

  const todo = new Todo({ value, order });
  await todo.save();

  res.send({ todo });
});

router.patch("/todos/:todoId", async (req, res) => {
  const { todoId } = req.params;
  const { order, value, done } = req.body;

  const todo = await Todo.findById(todoId).exec();

  if (order) {
    const targetTodo = await Todo.findOne({ order });
    if (targetTodo) {
      targetTodo.order = todo.order;
      await targetTodo.save();
    }
    todo.order = order;
  } else if (value) {
    todo.value = value;
  } else if (done !== undefined) {
    todo.doneAt = done ? new Date() : null;
  }
  
  await todo.save();

  //응답을 안주면 에러가 남 // 줄 값이 없어도 빈값으로 response를 줘야됨.
  res.send({});
});

//====== 삭제 
router.delete("/todos/:todoId", async (req, res) => {
  const { todoId } = req.params;
  const todo = await Todo.findById(todoId).exec();
  await todo.delete();
  res.send({});
});

//====== 미들웨어
app.use("/api", bodyParser.json(), router);
app.use(express.static("./assets"));

app.listen(8080, () => {
  console.log("서버가 켜졌어요!");
});