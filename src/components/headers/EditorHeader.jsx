import React, { useState } from 'react';
import SearchInput from "../inputs/SearchInput.jsx";
import EditorHeaderButton from "../buttons/EditorHeaderButton.jsx";
import {FaDownload, FaTimes} from 'react-icons/fa';
import ExportModal from '../forms/ExportModal.jsx';


function EditorHeader({ onExport }) {
    const [showExportModal, setShowExportModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (newValue) => {
        setSearchQuery(newValue); // Оновлюємо стан при зміні значення в інпуті
        // Тут можна виконувати фільтрацію даних таксономії на основі searchQuery
        // або передавати searchQuery в інший компонент/функцію для обробки.
    };

    return (
        <div className="flex items-center justify-between px-18 py-8 bg-blue self-stretch"> {/* Додано justify-between */}
            <SearchInput value={searchQuery} onChange={handleSearchChange} />
            <div className="flex items-center gap-8"> {/* Контейнер для кнопок */}

                <EditorHeaderButton
                    icon={FaDownload}
                    onClick={() => setShowExportModal(true)}
                    title="Експорт таксономії"
                />

                <EditorHeaderButton
                    onClick={() => {
                        console.log('Кнопку натиснуто!');
                    }}
                    icon={FaTimes}
                    title="Закрити"
                    className="hover:bg-gray-700 p-2 rounded"
                >
                </EditorHeaderButton>

                <ExportModal
                    show={showExportModal}
                    onClose={() => setShowExportModal(false)}
                    onExport={onExport}
                />
            </div>
        </div>
    );
}

export default EditorHeader;