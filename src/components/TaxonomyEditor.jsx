import ConceptDetails from './ConceptDetails';
import TreeView from "./visualisation/TreeView.jsx";
import React, {useEffect, useState} from "react";
import {fetchTaxonomyTree, exportTaxonomy, clearRepository} from '../services/api';
import EditorHeader from "./headers/EditorHeader.jsx";
import {useNavigate} from 'react-router-dom';
import ExportModal from "./modals/ExportModal.jsx";
import CloseConfirmationModal from "./modals/CloseConfirmationModal.jsx";

function TaxonomyEditor({setTaxonomyData}) {
    const [selectedConcept, setSelectedConcept] = useState(null);
    const [treeData, setTreeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTree, setRefreshTree] = useState(false);
    const navigate = useNavigate();

    const [showExportModal, setShowExportModal] = useState(false);
    const [showCloseConfirmationModal, setShowCloseConfirmationModal] = useState(false);

    useEffect(() => {
        const loadTaxonomy = async () => {
            setLoading(true);
            try {
                const data = await fetchTaxonomyTree();
                if (data && data.length > 0) {
                    setTreeData(data);
                    setTaxonomyData(data);
                } else {
                    setTaxonomyData([]);
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

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            <EditorHeader onExport={() => setShowExportModal(true)}
                          onClose={() => setShowCloseConfirmationModal(true)}
            />
            <div className="flex px-18 py-0 justify-center items-start gap-6 h-full">

                <TreeView
                    treeData={treeData}
                    refreshTaxonomyTree={refreshTaxonomyTree}
                    onSelect={handleConceptSelect}
                    loading={loading}
                />

                <ConceptDetails
                    concept={selectedConcept}
                    refreshTaxonomyTree={refreshTaxonomyTree}
                    setSelectedConcept={setSelectedConcept}
                />

                <ExportModal
                    show={showExportModal}
                    onClose={() => setShowExportModal(false)}
                    onExport={handleExport}
                />
                <CloseConfirmationModal
                    show={showCloseConfirmationModal}
                    onClose={handleClose}
                    onDiscard={() => setShowCloseConfirmationModal(false)}
                />
            </div>
        </div>
    );
}

export default TaxonomyEditor;