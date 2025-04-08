import React, {useState, useEffect} from 'react';
import EditCircle from "./icons/EditCircle.jsx";
import AddCircle from "./icons/AddCircle.jsx";
import DeleteCircle from "./icons/DeleteCircle.jsx";
import {addSubConcept, deleteConcept} from '../services/api';
import DefaultButton from "./buttons/DefaultButton.jsx";
import NewSubConceptModal from "./modals/NewSubConceptModal.jsx";
import DeleteConceptModal from "./modals/DeleteConceptModal.jsx";


function ConceptDetails({concept, refreshTaxonomyTree, setSelectedConcept}) {
    const [conceptName, setConceptName] = useState('');
    const [showNewSubclassModal, setShowNewSubclassModal] = useState(false);
    const [showDeleteConceptModal, setShowDeleteConceptModal] = useState(false);

    useEffect(() => {
        if (concept) {
            setConceptName(concept.title);
        } else {
            setConceptName('');
        }
    }, [concept]);

    const handleCreateSubclass = async (conceptData) => {
        try {
            await addSubConcept(conceptData.conceptName, concept.key);
            refreshTaxonomyTree();
            alert(`Subclass '${conceptData.conceptName}' successfully added to '${concept.title}'`);
        } catch (error) {
            console.error("Error adding subclass:", error);
            alert("Error adding subclass. Check console.");
        } finally {
            setShowNewSubclassModal(false);
        }
    };

    if (!concept) {
        return <div className="flex flex-col items-start gap-6 px-6 py-8 flex-1 h-full bg-white">
            Виберіть концепт для відображення деталей.</div>;
    }

    const handleDeleteConcept = async () => {
        try {
            await deleteConcept(concept.key);
            refreshTaxonomyTree();
            setSelectedConcept(null);
            alert(`Концепт '${concept.title}' успішно видалено.`);
        } catch (error) {
            console.error("Помилка при видаленні концепту:", error);
            alert("Помилка при видаленні концепту. Перевірте консоль.");
        }
    };

    return (
        <div className="flex flex-col items-start gap-6 px-6 py-8 flex-1 h-full bg-white">
            <h2 className="text-[32px] font-semibold text-black self-stretch font-inter">
                {conceptName}
            </h2>

            <div className="flex items-start gap-4 self-stretch">
                <DefaultButton
                    onClick={() => {
                        setShowNewSubclassModal(true)
                    }}
                >
                    Новий субклас
                </DefaultButton>
                <DefaultButton
                    onClick={
                    () => setShowDeleteConceptModal(true)
                }
                >
                    Видалити клас
                </DefaultButton>
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
                        <EditCircle className="w-5 h-5"/>
                        <DeleteCircle className="w-5 h-5"/>
                        <p className="text-black font-normal text-base font-inter">Текст</p>
                    </div>

                    <div className="flex items-center gap-1">
                        <AddCircle className="w-5 h-5"/>
                    </div>
                </div>
            </div>

            <NewSubConceptModal
                show={showNewSubclassModal}
                parentConcept={concept}
                onClose={() => setShowNewSubclassModal(false)}
                onCreate={(conceptData) => {
                    handleCreateSubclass(conceptData);
                }}
            />
            <DeleteConceptModal
                show={showDeleteConceptModal}
                onClose={handleDeleteConcept}
                onDiscard={() => setShowDeleteConceptModal(false)}
            />
        </div>
    );
}

export default ConceptDetails;