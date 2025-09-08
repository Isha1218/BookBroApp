import React, { useEffect, useState } from "react";
import BookGrid from "./BookGrid";
import SearchBar from "./SearchBar";
import TopBar from "./TopBar";
import { getBooks } from "../../api/database/BooksApi";

const HomePage = () => {
    const [books, setBooks] = useState([]);

    const fetchBooks = async() => {
        try {
            const data = await getBooks(1);
            setBooks(data);
        } catch (e) {
            console.error("Failed to getch books:", e);
        }
    }

    useEffect(() => {
        fetchBooks();
    }, []);

  return (
    <div style={{
        padding: '32px'
    }}>
      <TopBar userId={1} onUploadSuccess={fetchBooks}/>
      <SearchBar/>
      <BookGrid books={books}/>
    </div>
  );
};

export default HomePage;
