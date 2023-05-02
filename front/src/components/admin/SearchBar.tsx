import React, { useState } from 'react';
import "../../styles/SearchBar.css"

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [searchText, setSearchText] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const handleSearch = () => {
        onSearch(searchText);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Поиск..."
                value={searchText}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
            />
            <button onClick={handleSearch}>Поиск</button>
        </div>
    );
};

export default SearchBar;