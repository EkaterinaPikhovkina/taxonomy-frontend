import React from 'react';

function HomePageButton({ children, onClick, ...props }) {
    return (
        <button onClick={onClick} {...props} className="flex px-10 py-7 justify-center items-center gap-2.5 rounded-xl border border-black bg-white text-black font-inter text-xl font-normal">
            {children}
        </button>
    );
}

export default HomePageButton;