import React, {useState} from 'react';
import SearchInput from "../inputs/SearchInput.jsx";
import EditorHeaderButton from "../buttons/EditorHeaderButton.jsx";
import ExportModal from '../modals/ExportModal.jsx';
import CloseIcon from "../icons/CloseIcon.jsx";
import ExportIcon from "../icons/ExportIcon.jsx";
import EyeIcon from "../icons/EyeIcon.jsx";
import CloseConfirmationModal from "../modals/CloseConfirmationModal.jsx";
import { useNavigate } from 'react-router-dom';


function EditorHeader({onExport, onClose}) {
    const navigate = useNavigate();
    const [showExportModal, setShowExportModal] = useState(false);
    const [showCloseConfirmationModal, setShowCloseConfirmationModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (newValue) => {
        console.log(`Search query updated: ${newValue}`);
        setSearchQuery(newValue);
    };

    return (
        <div
            className="flex items-center justify-between px-18 py-8 bg-blue self-stretch">
            <SearchInput value={searchQuery} onChange={handleSearchChange}/>
            <div className="flex items-center gap-8">

                <EditorHeaderButton
                    onClick={() => navigate('/visualisation')}
                    icon={EyeIcon}
                    iconClassName="w-8 h-5"
                    title="Візуалізація"
                >
                </EditorHeaderButton>

                <EditorHeaderButton
                    onClick={() => setShowExportModal(true)}
                    icon={ExportIcon}
                    iconClassName="w-6 h-6"
                    title="Експорт"
                />

                <EditorHeaderButton
                    onClick={() => setShowCloseConfirmationModal(true)}
                    icon={CloseIcon}
                    iconClassName="w-5 h-5"
                    title="Закрити"
                >
                </EditorHeaderButton>

                <ExportModal
                    show={showExportModal}
                    onClose={() => setShowExportModal(false)}
                    onExport={onExport}
                />

                <CloseConfirmationModal
                    show={showCloseConfirmationModal}
                    onClose={onClose}
                    onDiscard={() => setShowCloseConfirmationModal(false)}
                />
            </div>
        </div>
    );
}

export default EditorHeader;