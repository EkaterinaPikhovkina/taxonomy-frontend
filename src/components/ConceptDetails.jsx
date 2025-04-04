import React, {useState, useEffect} from 'react';
import EditCircle from "./icons/EditCircle.jsx";
import AddCircle from "./icons/AddCircle.jsx";
import DeleteCircle from "./icons/DeleteCircle.jsx";
import { addConcept, deleteConcept } from '../services/api';


function ConceptDetails({concept, refreshTaxonomyTree, setSelectedConcept}) {
    const [conceptName, setConceptName] = useState('');


    useEffect(() => {
        if (concept) {
            setConceptName(concept.title);
        } else {
            setConceptName('');
        }
    }, [concept]);

    if (!concept) {
        return <div className="flex flex-col items-start gap-6 px-6 py-8 flex-1 h-full bg-white">
            Виберіть концепт для відображення деталей.</div>;
    }

    const handleAddConcept = async () => {
        const newConceptName = prompt("Введіть назву нового концепту:");
        if (newConceptName) {
            try {
                await addConcept(newConceptName, concept.key);
                refreshTaxonomyTree(); // Оновлюємо дерево після додавання
                alert(`Концепт '${newConceptName}' успішно додано до '${concept.title}'`);
            } catch (error) {
                console.error("Помилка при додаванні концепту:", error);
                alert("Помилка при додаванні концепту. Перевірте консоль.");
            }
        }
    };

    const handleDeleteConcept = async () => {
        if (window.confirm(`Ви впевнені, що хочете видалити концепт '${concept.title}'?`)) {
            try {
                await deleteConcept(concept.key);
                refreshTaxonomyTree(); // Оновлюємо дерево після видалення
                setSelectedConcept(null); // Clear selected concept after deletion
                alert(`Концепт '${concept.title}' успішно видалено.`);
            } catch (error) {
                console.error("Помилка при видаленні концепту:", error);
                alert("Помилка при видаленні концепту. Перевірте консоль.");
            }
        }
    };

    return (
        <div className="flex flex-col items-start gap-6 px-6 py-8 flex-1 h-full bg-white">
            <h2 className="text-[32px] font-semibold text-black self-stretch font-inter">
                {conceptName}
            </h2>

            <div className="flex items-start gap-4 self-stretch">
                <button
                    className="flex py-3 px-7 justify-center items-center gap-2.5 rounded-md bg-blue text-white font-semibold text-[18px] font-inter"
                    onClick={handleAddConcept}
                >
                    Новий концепт
                </button>
                <button
                    className="flex py-3 px-7 justify-center items-center gap-2.5 rounded-md bg-blue text-white font-semibold text-[18px] font-inter"
                    onClick={handleDeleteConcept}
                >
                    Видалити концепт
                </button>
            </div>

            <div className="flex p-4 flex-col items-start gap-4 self-stretch rounded-xl bg-gray-100">
                <h3 className="text-black font-semibold text-[18px] self-stretch font-inter">
                    Documentation Properties
                </h3>
                <div
                    className="flex px-3.5 py-2.5 flex-col items-start gap-2 self-stretch rounded-md bg-white">
                    <p className="text-black font-semibold text-base font-inter">
                        Визначення
                    </p>

                    <div
                        className="flex justify-center items-center gap-2">
                        <EditCircle className="w-5 h-5" />
                        <DeleteCircle className="w-5 h-5" />
                        <p className="text-black font-normal text-base font-inter">Текст</p>
                    </div>

                    <div className="flex items-center gap-1"> {/* Елемент 3: Контейнер з іконкою плюса в кружечку */}
                        <AddCircle className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConceptDetails;