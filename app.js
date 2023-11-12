const bcrypt = require("bcrypt");
const express = require("express");

const { sequelize, User, TodoList, TodoItem } = require("./models");

sequelize.sync({ force: true }).then(() => {
  console.log("Database synchronized");
});

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
