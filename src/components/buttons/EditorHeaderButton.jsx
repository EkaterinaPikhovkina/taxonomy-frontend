import React from 'react';

function EditorHeaderButton({ children, onClick, icon: Icon, ...props }) {
    return (
        <button onClick={onClick} {...props} className="text-white font-inter text-lg font-normal flex items-center">
            {Icon && <Icon className="mr-2" />}
            {children}
        </button>
    );
}

export default EditorHeaderButton;