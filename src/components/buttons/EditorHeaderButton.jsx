import React from 'react';

function EditorHeaderButton({ children, onClick, ...props }) {
    return (
        <button onClick={onClick} {...props} className="text-white font-inter text-lg font-normal">
            {children}
        </button>
    );
}

export default EditorHeaderButton;