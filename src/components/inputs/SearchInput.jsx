import React from 'react';
import { FaSearch } from 'react-icons/fa';

function SearchInput({ value, onChange }) {
    return (
        <div className="flex items-center w-[471px] px-4 py-3 gap-4 rounded-md bg-gray-100">
            <FaSearch className="text-gray-500" />
            <input
                type="text"
                placeholder="Пошук..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 bg-transparent text-black placeholder-gray-500 font-inter text-base font-normal outline-none"
            />
        </div>
    );
}

export default SearchInput;