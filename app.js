const bcrypt = require("bcrypt");
const express = require("express");
const session = require("express-session");

const { sequelize, User, TodoList, TodoItem } = require("./models");

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

const authMiddleware = (req, res, next) => {
  if (req.session.uid) {
    return next();
  } else {
    return res.status(401).json({ error: "Not authenticated" });
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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
