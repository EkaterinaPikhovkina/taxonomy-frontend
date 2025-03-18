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

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>Імпорт таксономії</h2>
                <input type="file" onChange={handleFileChange} accept=".ttl,.rdf" />
                {error && <p className="error-message">{error}</p>}
                <button onClick={handleImport} disabled={!selectedFile}>
                    Імпортувати
                </button>
                <button onClick={onClose}>Закрити</button>
            </div>
        </div>
    );
}

export default ImportForm;