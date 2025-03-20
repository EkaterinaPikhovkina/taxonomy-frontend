import React from 'react';

function HomePageHeader({ title }) {
    return (
        <div className="flex items-center px-18 py-8 bg-blue self-stretch">
            {title && <h1 className="text-white font-inter text-3xl font-semibold">{title}</h1>}
        </div>
    );
}

export default HomePageHeader;