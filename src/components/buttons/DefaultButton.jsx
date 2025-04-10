import React from 'react';

function DefaultButton({ children, onClick, disabled, className = "", ...props }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex px-7 py-3 justify-center items-center gap-2.5 rounded-md bg-blue text-white font-semibold text-base font-inter disabled:bg-gray-500  cursor-pointer ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export default DefaultButton;