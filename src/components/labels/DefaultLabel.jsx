import React from 'react';

function DefaultLabel({ children, className = "", ...props }) {
    return (
        <span
            className={`inline-flex px-2 py-0.5 justify-center items-center rounded-md bg-blue 
            text-white text-xs font-inter font-medium cursor-pointer ${className}`}
            {...props}
        >
            {children}
        </span>
    );
}

export default DefaultLabel;