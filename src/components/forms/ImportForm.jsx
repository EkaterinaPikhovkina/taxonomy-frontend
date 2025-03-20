import React, {useState} from 'react';

function ImportForm({ show, onClose, onImport }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');

    if (!show) {
        return null;
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && (file.name.endsWith('.ttl') || file.name.endsWith('.rdf'))) {
            setSelectedFile(file);
            setError('');
        } else {
            setSelectedFile(null);
            setError('Непідтримуваний формат файлу. Виберіть .ttl або .rdf.');
        }
    };

    const handleImport = () => {
        if (selectedFile) {
            onImport(selectedFile); // Передаємо файл у функцію onImport
        }
    };

    // return (
    //     <div className="modal-backdrop">
    //         <div className="modal">
    //             <h2>Імпорт таксономії</h2>
    //             <input type="file" onChange={handleFileChange} accept=".ttl,.rdf" />
    //             {error && <p className="error-message">{error}</p>}
    //             <button onClick={handleImport} disabled={!selectedFile}>
    //                 Імпортувати
    //             </button>
    //             <button onClick={onClose}>Закрити</button>
    //         </div>
    //     </div>
    // );

    return (
        <div className="modal-backdrop fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center">
            <div className="modal bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Імпорт таксономії</h2>
                <input type="file" onChange={handleFileChange} accept=".ttl,.rdf" className="mb-4" />
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="flex justify-end">
                    <button onClick={handleImport} disabled={!selectedFile} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 mr-2">
                        Імпортувати
                    </button>
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                        Закрити
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ImportForm;