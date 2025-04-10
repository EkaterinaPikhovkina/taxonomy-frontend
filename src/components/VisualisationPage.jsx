import React from 'react';
import CirclePackingDiagram from './visualisation/CirclePackingDiagram.jsx'; // Путь к новому компоненту
import { Link } from 'react-router-dom'; // Для кнопки "Назад"

function VisualisationPage({ taxonomyData }) { // Принимаем данные как проп

    return (
        <div className="p-4 flex flex-col items-center h-screen bg-gray-50">
            <h1 className="text-2xl font-bold mb-4 text-gray-700">Візуалізація Таксономії (Circle Packing)</h1>

            <div className="mb-4">
                <Link to="/editor" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Назад до Редактора
                </Link>
            </div>

            <div className="w-full flex-grow flex items-center justify-center">
                {taxonomyData && taxonomyData.length > 0 ? (
                    <CirclePackingDiagram data={taxonomyData} width={800} height={800} />
                ) : (
                    <p className="text-gray-500">Немає даних для візуалізації. Завантажте або створіть таксономію в редакторі.</p>
                )}
            </div>
        </div>
    );
}

export default VisualisationPage;