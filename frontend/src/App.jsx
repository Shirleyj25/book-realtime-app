import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const API_URL = "https://book-realtime-app.onrender.com";

const socket = io(API_URL);

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {

    // Fetch books initially
    axios.get(`${API_URL}/books`)
      .then((res) => {
        setBooks(res.data);
      })
      .catch((err) => console.error(err));

    // Socket connection logs
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    // Real-time event: book added
    socket.on("bookAdded", (book) => {
      setBooks((prev) => [...prev, book]);
    });

    // Real-time event: book updated
    socket.on("bookUpdated", (updatedBook) => {
      setBooks((prev) =>
        prev.map((b) =>
          b.id === updatedBook.id ? updatedBook : b
        )
      );
    });

    // Cleanup listeners
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("bookAdded");
      socket.off("bookUpdated");
    };

  }, []);

  // Add new book
  const addBook = async () => {
    if (!title || !author) return;

    try {
      await axios.post(`${API_URL}/books`, {
        title,
        author
      });

      setTitle("");
      setAuthor("");

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>📚 Real-Time Book List</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginRight: "10px" }}
        />

        <input
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={{ marginRight: "10px" }}
        />

        <button onClick={addBook}>Add Book</button>
      </div>

      <h2>Books</h2>

      {books.length === 0 && <p>No books yet</p>}

      {books.map((book) => (
        <div
          key={book.id}
          style={{
            padding: "10px",
            border: "1px solid #ddd",
            marginBottom: "10px"
          }}
        >
          <b>{book.title}</b> — {book.author}
        </div>
      ))}

    </div>
  );
}

export default App;