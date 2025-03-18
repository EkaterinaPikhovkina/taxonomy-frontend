import React from 'react';

function SearchInput({ value, onChange }) {
    return (
        <input
            type="text"
            placeholder="Пошук..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}

export default SearchInput;