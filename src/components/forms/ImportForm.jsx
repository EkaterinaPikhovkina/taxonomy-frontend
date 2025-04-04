import React, {useState} from 'react';
import CloseIcon from "../icons/CloseIcon.jsx";
import DefaultButton from "../buttons/DefaultButton.jsx";
import { useNavigate } from 'react-router-dom';

function ImportForm({ show, onClose, onImport, setTaxonomyData }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [fileNameText, setFileNameText] = useState("Обрати файл");
    const navigate = useNavigate();

    if (!show) {
        return null;
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && (file.name.endsWith('.ttl'))) {
            setSelectedFile(file);
            setError('');
            setFileNameText(file.name);
        } else {
            setSelectedFile(null);
            setError('Непідтримуваний формат файлу. Виберіть .ttl.');
            setFileNameText("Обрати файл");
        }
    };

    const handleImport = async () => {
        if (selectedFile) {
            try {
                await onImport(selectedFile, setTaxonomyData);
                navigate('/editor');
            } catch (error) {
                console.error("Помилка імпорту:", error);
                setError("Помилка імпорту таксономії.");
            }
        }
    };

    const resetFileNameText = () => {
        setFileNameText("Обрати файл");
    }

    return (
        <div className="modal-backdrop fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center">
            <div className="flex w-[500px] flex-col items-start bg-gray-100">

                <div className="flex px-8 py-4 justify-between items-center self-stretch bg-blue">
                    <p className="text-white text-lg font-semibold leading-normal">Імпорт таксономії</p>
                    <CloseIcon onClick={() => { onClose(); resetFileNameText(); }} />
                </div>

                <div className="flex p-6 flex-col items-start gap-6 self-stretch">
                    <div className="flex p-6 flex-col items-start gap-2 self-stretch rounded-[12px] bg-white">
                        <div
                            htmlFor="file-input"
                            className="flex py-3 px-4 items-center self-stretch border border-dashed border-gray-500 rounded-[6px] cursor-pointer"
                            onClick={() => document.getElementById('file-input').click()}
                        >
                            <span className="text-black text-base font-normal leading-normal">
                                {fileNameText}
                            </span>
                            <input
                                id="file-input"
                                type="file"
                                onChange={handleFileChange}
                                accept=".ttl"
                                className="hidden"
                            />
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                    </div>

                    <div className="self-end">
                        <DefaultButton
                            onClick={handleImport}
                            disabled={!selectedFile}
                        >
                            Імпортувати
                        </DefaultButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImportForm;