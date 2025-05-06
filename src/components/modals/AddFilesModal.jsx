import React, {useState} from 'react';
import CloseIcon from "../icons/CloseIcon.jsx";
import DefaultButton from "../buttons/DefaultButton.jsx";

function AddFilesModal({show, onClose, onCreate}) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [error, setError] = useState('');

    if (!show) {
        return null;
    }

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const newSelectedFiles = [];
        const currentFileNames = new Set([...selectedFiles.map(f => f.name), ...newSelectedFiles.map(f => f.name)]);
        let anyInvalidFile = false;
        let newErrorMessages = [];

        files.forEach(file => {
            if (file && file.name.endsWith('.txt')) {
                if (!currentFileNames.has(file.name)) {
                    newSelectedFiles.push(file);
                    currentFileNames.add(file.name); // Add to set to check duplicates within the current selection
                } else {
                    newErrorMessages.push(`Файл "${file.name}" вже додано.`);
                    anyInvalidFile = true;
                }
            } else {
                newErrorMessages.push(`Файл "${file.name}" має непідтримуваний формат. Виберіть .txt.`);
                anyInvalidFile = true;
            }
        });

        setSelectedFiles(prevFiles => [...prevFiles, ...newSelectedFiles]);

        if (anyInvalidFile) {
            setError(newErrorMessages.join(' '));
        } else {
            setError('');
        }
        event.target.value = null; // Allow re-selecting the same file if removed
    };

    const handleRemoveFile = (fileName) => {
        setSelectedFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
        if (selectedFiles.length - 1 === 0) {
            setError('');
        }
    };

    const handleSubmit = async () => {
        if (selectedFiles.length > 0) {
            try {
                await onCreate(selectedFiles);
                // Closing and navigation are now handled by HomePage after successful onCreate
            } catch (err) { // Catch error from onCreate (e.g., API error)
                console.error("Помилка під час створення таксономії:", err);
                setError(err.message || "Помилка створення таксономії з корпусу документів.");
            }
        }
    };

    const resetAndClose = () => {
        setSelectedFiles([]);
        setError('');
        onClose();
    };

    const getFileSelectionText = () => {
        if (selectedFiles.length === 0) {
            return "Обрати файли (.txt)";
        }
        if (selectedFiles.length === 1) {
            return selectedFiles[0].name;
        }
        return `${selectedFiles.length} файлів обрано`;
    };

    return (
        <div className="modal-backdrop fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50">
            <div className="flex w-[600px] flex-col items-start bg-gray-100 rounded-lg shadow-xl">
                <div className="flex px-8 py-4 justify-between items-center self-stretch bg-blue rounded-t-lg">
                    <p className="text-white text-lg font-semibold leading-normal">Створити таксономію з корпусу</p>
                    <CloseIcon className="w-4 h-4 cursor-pointer text-white hover:text-gray-300" onClick={resetAndClose}/>
                </div>

                <div className="flex p-6 flex-col items-start gap-6 self-stretch">
                    <div className="flex p-6 flex-col items-start gap-4 self-stretch rounded-[12px] bg-white w-full">
                        <label
                            htmlFor="file-input-corpus"
                            className="file-input flex py-3 px-4 items-center justify-center self-stretch border-2 border-dashed border-gray-400 rounded-[6px] cursor-pointer hover:border-blue-500 transition-colors"
                        >
                            <span className="text-gray-700 text-base font-normal leading-normal">
                                {getFileSelectionText()}
                            </span>
                            <input
                                id="file-input-corpus"
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                accept=".txt"
                                className="hidden"
                            />
                        </label>

                        {selectedFiles.length > 0 && (
                            <div className="self-stretch mt-2 space-y-2 max-h-48 overflow-y-auto p-1 border rounded">
                                <p className="text-sm font-semibold text-gray-700 mb-1 sticky top-0 bg-white py-1">Обрані файли:</p>
                                {selectedFiles.map(file => (
                                    <div key={file.name} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                                        <span className="text-gray-800 truncate w-full pr-2" title={file.name}>{file.name}</span>
                                        <button
                                            onClick={() => handleRemoveFile(file.name)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Видалити файл"
                                        >
                                            <CloseIcon className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>

                    <div className="self-end">
                        <DefaultButton
                            onClick={handleSubmit}
                            disabled={selectedFiles.length === 0}
                        >
                            Створити таксономію
                        </DefaultButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddFilesModal;