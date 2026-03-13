const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// In-memory book storage
let books = [];

// WebSocket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Get all books
app.get("/books", (req, res) => {
  res.json(books);
});

// Add new book
app.post("/books", (req, res) => {
  const newBook = {
    id: Date.now(),
    title: req.body.title,
    author: req.body.author
  };

  books.push(newBook);

  // Broadcast to all clients
  io.emit("bookAdded", newBook);

  res.json(newBook);
});

// Update book
app.put("/books/:id", (req, res) => {
  const id = Number(req.params.id);

  books = books.map((book) =>
    book.id === id ? { ...book, ...req.body } : book
  );

  const updatedBook = books.find((b) => b.id === id);

  // Broadcast update
  io.emit("bookUpdated", updatedBook);

  res.json(updatedBook);
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});