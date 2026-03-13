import React, { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "./socket";

function BookList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {

    // Initial fetch
    axios.get("http://localhost:5000/books")
      .then(res => setBooks(res.data));

    // Listen for new book
    socket.on("bookAdded", (book) => {
      setBooks((prev) => [...prev, book]);
    });

    // Listen for updates
    socket.on("bookUpdated", (updatedBook) => {
      setBooks((prev) =>
        prev.map((b) =>
          b.id === updatedBook.id ? updatedBook : b
        )
      );
    });

    return () => {
      socket.off("bookAdded");
      socket.off("bookUpdated");
    };

  }, []);

  return (
    <div>
      <h2>Books</h2>

      {books.map((book) => (
        <div key={book.id}>
          <h4>{book.title}</h4>
          <p>{book.author}</p>
        </div>
      ))}

    </div>
  );
}

export default BookList;