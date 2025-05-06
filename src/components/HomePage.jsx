import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import HomePageHeader from './headers/HomePageHeader.jsx';
import HomePageButton from './buttons/HomePageButton.jsx';
import {clearRepository, createTaxonomyFromCorpusLLM, importTaxonomyFromFile} from "../services/api.js";
import ImportModal from "./modals/ImportModal.jsx";
import AddFilesModal from "./modals/AddFilesModal.jsx";


function HomePage({setTaxonomyData}) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showImportForm, setShowImportForm] = useState(false);
    const [showAddFilesForm, setShowAddFilesForm] = useState(false);

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

    const handleCreateTaxonomyFromCorpus = async (files) => {
        if (!files || files.length === 0) {
            // This case should ideally be handled by the modal's button disable logic
            alert("Будь ласка, оберіть файли для створення таксономії.");
            return;
        }
        setLoading(true);
        try {
            await clearRepository();
            console.log("Репозиторій очищено перед створенням таксономії з корпусу.");

            // Call the new API function that will handle LLM processing and import
            await createTaxonomyFromCorpusLLM(files);
            console.log("Таксономія з корпусу успішно створена та імпортована.");

            if (setTaxonomyData) {
                setTaxonomyData([]); // Reset client-side data
            }

            setShowAddFilesForm(false); // Close modal on success
            navigate('/editor');     // Navigate to editor to see the new taxonomy

        } catch (error) {
            console.error("Помилка при створенні таксономії з корпусу:", error);
            // The error message will be displayed in the modal if setError is called there
            // or use a general alert here if the modal doesn't show API errors directly.
            // For now, AddFilesModal's own error state will handle it.
            // If error is from API, it's re-thrown by api.js and caught here.
            // The modal's handleSubmit will also catch this and set its local error.
            alert(`Помилка при створенні таксономії з корпусу: ${error.message || "Перевірте консоль."}`);
            // Do not close modal on error, let user see error
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
                <HomePageButton
                    onClick={() => setShowImportForm(true)}
                >
                    Імпортувати таксономію
                </HomePageButton>
                <HomePageButton
                    onClick={() => setShowAddFilesForm(true)}
                >
                    Створити таксономію з корпусу документів
                </HomePageButton>
            </div>

            <ImportModal
                show={showImportForm}
                onClose={() => setShowImportForm(false)}
                onImport={(file) => handleImport(file, setTaxonomyData)}
                setTaxonomyData={setTaxonomyData}
            />

            <AddFilesModal
                show={showAddFilesForm}
                onClose={() => setShowAddFilesForm(false)}
                onCreate={handleCreateTaxonomyFromCorpus}
            />

        </div>
    );
}

export default HomePage;