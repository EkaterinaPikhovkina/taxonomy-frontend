import React from 'react';
import SearchInput from "../inputs/SearchInput.jsx";
import EditorHeaderButton from "../buttons/EditorHeaderButton.jsx";

function EditorHeader() {
    return (
        <div className="flex items-center justify-between px-16 py-8 bg-blue self-stretch"> {/* Додано justify-between */}
            <SearchInput value="" onChange={() => {}} />
            <div className="flex items-center gap-8"> {/* Контейнер для кнопок */}
                <EditorHeaderButton onClick={() => { console.log('Кнопку натиснуто!'); }}>ЗБЕРЕГТИ</EditorHeaderButton>
                <EditorHeaderButton onClick={() => { console.log('Кнопку натиснуто!'); }}>ЗАКРИТИ</EditorHeaderButton>
                <EditorHeaderButton onClick={() => { console.log('Кнопку натиснуто!'); }}>ЕКСПОРТ</EditorHeaderButton>
            </div>
        </div>
    );
}

export default EditorHeader;