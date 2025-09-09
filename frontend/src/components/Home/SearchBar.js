import React, {useState} from "react";
import { LuSearch } from "react-icons/lu";

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value.trim())
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && searchTerm.trim().length >= 2) {
            e.target.blur();
            onSearch(searchTerm.trim());
        } else if (e.key === 'Enter' && searchTerm.trim().length === 0) {
            onSearch('');
        }
    };

    const handleBlur = () => {
        if (searchTerm.trim().length >= 2) {
            onSearch(searchTerm.trim());
        } else if (searchTerm.trim().length === 0) {
            onSearch('');
        }
    };

    return (
        <div style={{
            backgroundColor: '#ececec',
            borderRadius: '10px',
            padding: '10px 16px 10px 16px',
            display: 'flex',
            flexDirection: 'row',
            gap: '10px',
            alignItems: 'center',
        }}>
            <LuSearch />
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                placeholder="Search books by title or author..."
                style={{
                    margin: 0,
                    color: '#919191',
                    fontSize: '14px',
                    wordSpacing: '2px',
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    color: searchTerm ? '#000' : '#919191'
                }}
            />
        </div>
    );
};

export default SearchBar;