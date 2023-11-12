const bcrypt = require("bcrypt");
const express = require("express");
const session = require("express-session");

const { sequelize, User, UserTodo, TodoList, TodoItem } = require("./models");

sequelize.sync().then(() => {
  console.log("Database synchronized");
});

const app = express();
app.use(express.json());
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);

const isAuthenticated = (req, res, next) => {
  if (req.session.uid) {
    return next();
  } else {
    return res.status(401).json({ error: "Not authenticated" });
  }
};

const canAccessTodoList = async (req, res, next) => {
  const uid = req.session.uid;
  const listId = req.params.listId;

  try {
    const permission = await UserTodo.findOne({
      where: { user_id: uid, list_id: listId },
    });

    if (
      permission &&
      (permission.access_type === "edit" || permission.access_type === "view")
    ) {
      return next();
    } else {
      return res.status(403).json({ error: "Not authorized" });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

const canEditTodoList = async (req, res, next) => {
  const uid = req.session.uid;
  const listId = req.params.listId;

  try {
    const permission = await UserTodo.findOne({
      where: { user_id: uid, list_id: listId },
    });

    if (permission && permission.access_type === "edit") {
      return next();
    } else {
      return res.status(403).json({ error: "Not authorized" });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: "Missing required body params" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    // Create a session after registering
    req.session.uid = user.id;
    req.session.username = user.username;

    return res.status(201).json({ message: "User created successfully", user });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing required body params" });
  }

  try {
    const user = await User.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create a session on successful login
      req.session.uid = user.id;
      req.session.username = user.username;

      const { id, username, email } = user;
      return res.json({
        message: "Login successful",
        user: { id, username, email },
      });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((e) => {
    if (e) return res.status(500).json({ error: e.message });
    return res.json({ message: "Logout successful" });
  });
});

app.get("/lists", isAuthenticated, async (req, res) => {
  const uid = req.session.uid;

  try {
    const lists = (
      await UserTodo.findAll({
        where: { user_id: uid },
        include: [{ model: TodoList }],
      })
    ).map((userTodo) => ({
      ...userTodo.TodoList.get({ plain: true }),
      access_type: userTodo.access_type,
    }));

    if (lists && lists.length) {
      return res.json(lists);
    }

    return res
      .status(404)
      .json({ error: `No to-do lists found for user with id ${uid}` });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.post("/lists", isAuthenticated, async (req, res) => {
  const uid = req.session.uid;
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Missing required body params" });
  }

  try {
    const transaction = await sequelize.transaction();

    const list = await TodoList.create(
      { title, description, owner_id: uid },
      { transaction }
    );
    await UserTodo.create(
      { user_id: uid, list_id: list.id, access_type: "edit" },
      { transaction }
    );

    await transaction.commit();

    return res
      .status(201)
      .json({ message: "To-do list created successfully", list });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.get(
  "/lists/:listId/items",
  isAuthenticated,
  canAccessTodoList,
  async (req, res) => {
    const listId = req.params.listId;

    try {
      const list = await TodoList.findByPk(listId);
      if (!list) {
        return res
          .status(404)
          .json({ message: `No to-do list found for id ${listId}` });
      }

      const items = await TodoItem.findAll({ where: { list_id: listId } });
      if (items && items.length) {
        return res.json(items);
      }

      return res
        .status(404)
        .json({ message: `No to-do items found for list with id ${listId}` });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }
);

app.post(
  "/lists/:listId/items",
  isAuthenticated,
  canEditTodoList,
  async (req, res) => {
    const listId = req.params.listId;
    const { content, due_date } = req.body;

    if (!content || !due_date) {
      return res.status(400).json({ error: "Missing required body params" });
    }

    try {
      const list = await TodoList.findByPk(listId);
      if (!list) {
        return res
          .status(404)
          .json({ message: `No to-do list found for id ${listId}` });
      }

      await TodoItem.create({
        content,
        due_date,
        list_id: listId,
      });

      const updatedList = await TodoList.findOne({
        where: { id: listId },
        include: [{ model: TodoItem, as: "items" }],
      });

      return res.status(201).json({
        message: "To-do item created successfully",
        list: updatedList,
      });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
