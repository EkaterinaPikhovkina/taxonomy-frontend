import React, {useState, useEffect} from 'react';
import EditCircle from "./icons/EditCircle.jsx";
import DeleteCircle from "./icons/DeleteCircle.jsx";
import {addSubConcept, deleteConcept, updateConceptName} from '../services/api';
import DefaultButton from "./buttons/DefaultButton.jsx";
import NewSubConceptModal from "./modals/NewSubConceptModal.jsx";
import DeleteConceptModal from "./modals/DeleteConceptModal.jsx";
import EditIcon from "./icons/EditIcon.jsx";
import DefaultLabel from "./labels/DefaultLabel.jsx";
import AddCircle from "./icons/AddCircle.jsx";


function ConceptDetails({concept, refreshTaxonomyTree, setSelectedConcept}) {
    const [conceptName, setConceptName] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempConceptName, setTempConceptName] = useState('');

    const [showNewSubclassModal, setShowNewSubclassModal] = useState(false);
    const [showDeleteConceptModal, setShowDeleteConceptModal] = useState(false);

    useEffect(() => {
        if (concept) {
            setConceptName(concept.title);
            setTempConceptName(concept.title);
            setIsEditingName(false);
        } else {
            setConceptName('');
            setTempConceptName('');
        }
    }, [concept]);

    const handleCreateSubclass = async (conceptData) => {
        try {
            await addSubConcept(conceptData.conceptName, concept.key);
            refreshTaxonomyTree();
            console.log(`Subclass '${conceptData.conceptName}' successfully added to '${concept.title}'`);
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
            console.log(`Концепт '${concept.title}' успішно видалено.`);
        } catch (error) {
            console.error("Помилка при видаленні концепту:", error);
            alert("Помилка при видаленні концепту. Перевірте консоль.");
        }
    };

    const handleSaveConceptName = async () => {
        if (tempConceptName.trim() === "") {
            alert("Имя концепта не может быть пустым.");
            return;
        }
        if (tempConceptName.trim() === conceptName) {
            setIsEditingName(false);
            return;
        }

        await updateConceptName(concept.key, tempConceptName);
        setConceptName(tempConceptName);
        setIsEditingName(false);
        refreshTaxonomyTree();
    };

    const handleCancelEditConceptName = () => {
        setTempConceptName(conceptName);
        setIsEditingName(false);
    };

    return (
        <div className="flex flex-col items-start gap-6 px-6 py-8 flex-1 h-full bg-white overflow-auto">
            <div className="flex items-center gap-2">
                {isEditingName ? (
                    <input type="text"
                           className="block w-full px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                           value={tempConceptName}
                           onChange={(e) => setTempConceptName(e.target.value)}
                           onKeyDown={(e) => {
                               if (e.key === 'Enter') {
                                   handleSaveConceptName();
                               }
                           }}
                           onBlur={handleCancelEditConceptName}
                    />
                ) : (
                    <div className="flex items-center gap-4 self-stretch">
                        <h2 className="text-[32px] font-semibold text-black self-stretch font-inter">
                            {conceptName}
                        </h2>
                        <EditIcon className="w-6 h-6 shrink-0 cursor-pointer stroke-gray-500"
                                  onClick={() => setIsEditingName(true)}/>
                    </div>
                )}
            </div>
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
                    Властивості документації
                </h3>
                <div
                    className="flex px-3.5 py-2.5 flex-col items-start gap-2 self-stretch rounded-md bg-white">
                    <p className="text-black font-semibold text-base font-inter">
                        Визначення
                    </p>


                    <div className="flex flex-col items-start gap-2 self-stretch">
                        {concept.definitions && Array.isArray(concept.definitions) && concept.definitions.length > 0 ? (
                            concept.definitions.map((def, index) => (
                                <div key={`${concept.key}-def-${def.lang || 'none'}-${index}`}
                                     className="flex items-start gap-2 self-stretch py-1 border-b border-gray-100 last:border-b-0">

                                    <div className="flex gap-1.5 pt-1 flex-shrink-0">
                                        <EditCircle className="w-5 h-5 shrink-0 cursor-pointer"/>
                                        <DeleteCircle className="w-5 h-5 shrink-0 cursor-pointer"/>
                                    </div>

                                    <div className="flex gap-1 items-start">
                                        <p className="text-black font-normal text-base font-inter">
                                            <DefaultLabel
                                                className="mr-0.5 shrink-0">{def.lang || 'none'}</DefaultLabel> {def.value}
                                        </p>
                                    </div>
                                </div>

                            ))
                        ) : (
                            <p className="text-gray-500 font-normal text-base font-inter self-stretch py-1">
                                Визначення відсутні
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        <AddCircle className="w-5 h-5 shrink-0 cursor-pointer"/>
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
            </div>
        </div>
    );
}

export default ConceptDetails;