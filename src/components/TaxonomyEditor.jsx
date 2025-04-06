import ConceptDetails from './ConceptDetails';
import TreeView from "./visualisation/TreeView.jsx";
import React, {useEffect, useState} from "react";
import {fetchTaxonomyTree, exportTaxonomy, clearRepository, addTopConcept} from '../services/api';
import EditorHeader from "./headers/EditorHeader.jsx";
import {useNavigate} from 'react-router-dom';
import DefaultButton from "./buttons/DefaultButton.jsx";
import NewTopConceptModal from "./modals/NewTopConceptModal.jsx";

function TaxonomyEditor({setTaxonomyData}) {
    const [selectedConcept, setSelectedConcept] = useState(null);
    const [treeData, setTreeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTree, setRefreshTree] = useState(false);
    const navigate = useNavigate();
    const [showNewConceptModal, setShowNewConceptModal] = useState(false);

    useEffect(() => {
        const loadTaxonomy = async () => {
            setLoading(true);
            try {
                const data = await fetchTaxonomyTree();
                if (data && data.length > 0) {
                    setTreeData(data);
                    setTaxonomyData(data);
                    if (data.length > 0) {
                        setSelectedConcept(data[0]);
                    }
                } else {
                    setTaxonomyData([]);
                    setSelectedConcept(null);
                    setTreeData([]);
                }
            } catch (error) {
                console.error("Ошибка при загрузке таксономии:", error);
            } finally {
                setLoading(false);
                setRefreshTree(false);
            }
        };
        loadTaxonomy();


    }, [refreshTree]);

    const handleConceptSelect = (concept) => {
        console.log("TaxonomyEditor handleConceptSelect:", concept.title, concept.key);
        setSelectedConcept(concept);
    };

    const handleExport = async (format) => {
        try {
            await exportTaxonomy(format);
        } catch (error) {
            console.error("Помилка при експорті таксономії:", error);
            alert("Помилка при експорті таксономії. Перевірте консоль.");
        }
    };

    const handleClose = async () => {
        try {
            await clearRepository();
            navigate('/');
        } catch (error) {
            console.error("Помилка при очищенні репозиторію:", error);
            alert("Помилка при очищенні репозиторію. Перевірте консоль.");
        }
    };

    const refreshTaxonomyTree = () => {
        setRefreshTree(true);
    };

    const addTopLevelConcept = async (conceptData) => {
        try {
            await addTopConcept(conceptData.conceptName, conceptData.definition);
            await refreshTaxonomyTree();
            alert(`Top concept '${conceptData.conceptName}' successfully added`);
        } catch (error) {
            console.error("Error adding top concept:", error);
            alert("Error adding top concept. Check console.");
        } finally {
            setShowNewConceptModal(false);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            <EditorHeader onExport={handleExport}
                          onClose={handleClose}/>
            <div className="flex px-18 py-0 justify-center items-start gap-6 h-full">
                <div className="flex flex-col items-start pt-8 bg-white flex-1 h-full">
                    <TreeView
                        treeData={treeData}
                        onSelect={handleConceptSelect}
                        loading={loading}
                    />
                    <div className="sticky bottom-0 flex py-6 justify-center items-center self-stretch bg-white">
                        <DefaultButton
                            onClick={() => {
                                setShowNewConceptModal(true);
                            }}
                        >
                            Новий клас
                        </DefaultButton>
                    </div>
                    <NewTopConceptModal
                        show={showNewConceptModal}
                        onClose={() => setShowNewConceptModal(false)}
                        onCreate={(conceptData) => {
                            console.log("Creating top-level concept:", conceptData);
                            addTopLevelConcept(conceptData);
                        }}
                    />
                </div>
                <ConceptDetails
                    concept={selectedConcept}
                    refreshTaxonomyTree={refreshTaxonomyTree}
                    setSelectedConcept={setSelectedConcept}
                />
            </div>
        </div>
    );
}

export default TaxonomyEditor;