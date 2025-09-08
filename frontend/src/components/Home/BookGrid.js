import React from 'react';
import { FaPlay, FaCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { getStatus, updateBookStatus } from '../../api/database/BooksApi';

const BookGrid = ({ books }) => {
  const navigate = useNavigate();
  
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 150px))', 
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const bookButtonStyle = {
    aspectRatio: '0.7',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '15px',
    color: 'white',
    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    border: 'none',
    cursor: 'pointer',
    font: 'inherit',
    textAlign: 'left',
    position: 'relative',
  };

  const cornerItemStyle = {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: 'white',
    fontWeight: 'bold',
    padding: '2px',
  };

  const containerStyle = {
    minHeight: '100vh',
    paddingTop: '40px'
  };

  const handleClick = async (book) => {
    const status = await getStatus(book.id);
    if (status === 'start') {
        await updateBookStatus(book.id, 'in progress')
    }
    navigate(`/ebook_reader?file=${book.link}&title=${book.title}&currCfi=${book.curr_cfi}&bookId=${book.id}`)
  };

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        {books.map((book) => (
          <button
            key={book.id}
            style={{
              ...bookButtonStyle,
            //   backgroundColor: book.color
                backgroundImage: book.cover_image
                ? `url(data:image/jpeg;base64,${book.cover_image})`
                : `url(/harry_potter_cover.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
            onClick={() => handleClick(book)}
          >
            {book.status === 'start' ? (<div></div>) : <div style={cornerItemStyle}>
                {book.status === 'in progress' ? (<FaPlay color='white' size={10}/>) : (<FaCheck color='white' size={14}/>)} 
            </div>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookGrid;