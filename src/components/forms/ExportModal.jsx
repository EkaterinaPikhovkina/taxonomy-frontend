import React from 'react';

function ExportModal({ show, onClose, onExport }) {
    if (!show) {
        return null;
    }

    const handleExport = (format) => {
        onExport(format);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Експорт таксономії</h2>
                <div className="mb-4">
                    <label htmlFor="format" className="block text-sm font-medium text-gray-700">Виберіть формат:</label>
                    <select
                        id="format"
                        name="format"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        defaultValue="ttl"
                    >
                        <option value="ttl">Turtle (.ttl)</option>
                        <option value="rdf">RDF/XML (.rdf)</option>
                    </select>
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={() => handleExport(document.getElementById('format').value)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                    >
                        Експортувати
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        Скасувати
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ExportModal;