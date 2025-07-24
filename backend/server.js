const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("./db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = "your-secret-key"; // Replace with strong secret in production

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access token missing" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

app.get('/health', (req, res) => {
  res.sendStatus(200);
});

// Register new user
app.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const stmt = db.prepare(
      "INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)"
    );
    stmt.run(firstName, lastName, email, hashedPassword, function (err) {
      if (err) {
        return res.status(409).json({ error: "User already exists" });
      }
      res.status(201).json({ message: "User registered successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login user
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  });
});

// Get items (protected)
app.get("/items", authenticateToken, (req, res) => {
  db.all("SELECT * FROM items", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Add new item (protected)
app.post("/items", authenticateToken, (req, res) => {
  const { name, quantity } = req.body;
  if (!name || !quantity) {
    return res.status(400).json({ error: "Name and quantity are required" });
  }

  db.run(
    "INSERT INTO items (name, quantity) VALUES (?, ?)",
    [name, quantity],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, name, quantity });
    }
  );
});

// Update item (protected)
app.put("/items/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, quantity } = req.body;

  if (!name || !quantity) {
    return res.status(400).json({ error: "Name and quantity are required" });
  }

  db.run(
    "UPDATE items SET name = ?, quantity = ? WHERE id = ?",
    [name, quantity, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ message: "Item not found" });
      res.json({ id, name, quantity });
    }
  );
});

// Delete item (protected)
app.delete("/items/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM items WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ message: "Item not found" });
    res.status(204).end();
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server with SQLite + JWT running at http://localhost:${PORT}`)
);
