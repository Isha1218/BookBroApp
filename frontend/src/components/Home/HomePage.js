import React, { useEffect, useState } from "react";
import BookGrid from "./BookGrid";
import SearchBar from "./SearchBar";
import TopBar from "./TopBar";
import { getBooks } from "../../api/database/BooksApi";

const HomePage = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoadingBooks, setIsLoadingBooks] = useState(true);

    const fetchBooks = async() => {
        try {
            setIsLoadingBooks(true);
            const data = await getBooks(1);
            setBooks(data);
            setFilteredBooks(data);
        } catch (e) {
            console.error("Failed to fetch books:", e);
        } finally {
            setIsLoadingBooks(false);
        }
    }

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleSearch = (term) => {
        setSearchTerm(term);
        
        if (!term) {
            setFilteredBooks(books);
            return;
        }

        const filtered = books.filter(book => {
            const titleMatch = book.title?.toLowerCase().includes(term.toLowerCase());
            const authorMatch = book.author?.toLowerCase().includes(term.toLowerCase());
            
            return titleMatch || authorMatch;
        });

        setFilteredBooks(filtered);
    };

    useEffect(() => {
        if (searchTerm) {
            handleSearch(searchTerm);
        } else {
            setFilteredBooks(books);
        }
    }, [books]);

    const spinnerStyle = {
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #333',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    };

    const keyframes = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;

    const loadingContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
        gap: '20px'
    };

    return (
        <>
            <style>{keyframes}</style>
            <div style={{
                padding: '32px'
            }}>
                <TopBar userId={1} onUploadSuccess={fetchBooks}/>
                <SearchBar onSearch={handleSearch}/>
                
                {isLoadingBooks ? (
                    <div style={loadingContainerStyle}>
                        <div style={spinnerStyle}></div>
                        <p style={{
                            fontSize: '16px',
                            color: '#666',
                            margin: 0,
                            fontWeight: '500'
                        }}>
                            Loading your books...
                        </p>
                    </div>
                ) : (
                    <BookGrid books={filteredBooks}/>
                )}
            </div>
        </>
    );
};

export default HomePage;