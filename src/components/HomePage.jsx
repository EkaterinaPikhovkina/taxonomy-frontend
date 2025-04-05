import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import HomePageHeader from './headers/HomePageHeader.jsx';
import HomePageButton from './buttons/HomePageButton.jsx';
import {clearRepository, importTaxonomyFromFile} from "../services/api.js";
import ImportModal from "./modals/ImportModal.jsx";


function HomePage({setTaxonomyData}) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showImportForm, setShowImportForm] = useState(false);

    const handleCreateTaxonomy = async () => {
        setLoading(true);
        try {
            await clearRepository();
            console.log("Репозиторий очищен успешно");
            navigate('/editor');

        } catch (error) {
            console.error("Ошибка при очистке репозитория:", error);
            alert("Ошибка при очистке репозитория. Смотрите консоль.");
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async (file, taxonomySetter) => {
        setLoading(true);
        try {
            await clearRepository();
            console.log("Репозиторій очищено перед імпортом");

            await importTaxonomyFromFile(file);
            console.log("Таксономія імпортована успішно");

            if (taxonomySetter) {
                taxonomySetter([]);
            }

            setShowImportForm(false);
            navigate('/editor');

        } catch (error) {
            console.error("Помилка при імпорті таксономії:", error);
            alert("Помилка при імпорті таксономії. Перевірте консоль.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex flex-col bg-white">
            <HomePageHeader title="Taxonomy Builder"/>
            <div className="flex flex-col items-center justify-center gap-6 flex-1">
                <HomePageButton
                    onClick={handleCreateTaxonomy}
                    disabled={loading}
                >
                    {loading ? "Завантаження..." : "Створити нову таксономію"}
                </HomePageButton>
                <HomePageButton onClick={() => setShowImportForm(true)}>Імпортувати таксономію</HomePageButton>
            </div>

            <ImportModal
                show={showImportForm}
                onClose={() => setShowImportForm(false)}
                onImport={(file) => handleImport(file, setTaxonomyData)}
                setTaxonomyData={setTaxonomyData}
            />

        </div>
    );
}

export default HomePage;