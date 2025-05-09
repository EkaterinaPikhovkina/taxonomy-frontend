import ConceptDetails from './ConceptDetails';
import TreeView from "./visualisation/TreeView.jsx";
import React, {useEffect, useState} from "react";
import {fetchTaxonomyTree, exportTaxonomy, clearRepository} from '../services/api';
import EditorHeader from "./headers/EditorHeader.jsx";
import {useNavigate} from 'react-router-dom';
import ExportModal from "./modals/ExportModal.jsx";
import CloseConfirmationModal from "./modals/CloseConfirmationModal.jsx";


const findConceptInTreeRecursively = (nodes, key) => {
    if (!nodes || !Array.isArray(nodes) || !key) return null;
    for (const node of nodes) {
        if (!node) continue; // Skip if node is null or undefined
        if (node.key === key) return node;
        if (node.children && Array.isArray(node.children)) {
            const found = findConceptInTreeRecursively(node.children, key);
            if (found) return found;
        }
    }
    return null;
};

function TaxonomyEditor({setTaxonomyData}) {
    const [selectedConcept, setSelectedConcept] = useState(null);
    const [treeData, setTreeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTree, setRefreshTree] = useState(false);
    const navigate = useNavigate();

    const [showExportModal, setShowExportModal] = useState(false);
    const [showCloseConfirmationModal, setShowCloseConfirmationModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const newTreeData = await fetchTaxonomyTree();

                if (newTreeData && newTreeData.length > 0) {
                    setTreeData(newTreeData);
                    setTaxonomyData(newTreeData); // Propagate up to parent component

                    // Используем 'selectedConcept' из замыкания текущего запуска эффекта.
                    // Это значение 'selectedConcept' было актуальным на момент, когда
                    // эффект был запланирован к выполнению (т.е. при монтировании или изменении refreshTree).
                    if (selectedConcept && selectedConcept.key) {
                        const updatedSelectedConceptInstance = findConceptInTreeRecursively(newTreeData, selectedConcept.key);
                        setSelectedConcept(updatedSelectedConceptInstance);
                    } else {
                        // Если ранее выбранного концепта не было, или он не найден (что маловероятно, если key корректный),
                        // убедимся, что selectedConcept не содержит устаревших данных, если newTreeData пуст.
                        // В данном случае, если newTreeData пусто, selectedConcept и так станет null ниже.
                    }
                } else {
                    setTreeData([]);
                    setTaxonomyData([]);
                    setSelectedConcept(null);
                }
            } catch (error) {
                console.error("Ошибка при загрузке таксономии:", error);
                setTreeData([]);
                setTaxonomyData([]);
                setSelectedConcept(null);
            } finally {
                setLoading(false);
                // Если эффект был вызван из-за refreshTree === true, сбрасываем его.
                // `refreshTree` здесь - это значение из замыкания, которое было true,
                // когда эффект запускался.
                if (refreshTree) {
                    setRefreshTree(false);
                }
            }
        })(); // Immediately invoke the async function

        // `setTaxonomyData` включена в зависимости, так как это prop-функция.
        // Предполагается, что она стабильна (мемоизирована в родителе или является сеттером useState).
        // `selectedConcept` намеренно пропущен в зависимостях для этого эффекта.
        // Эффект предназначен для загрузки/обновления всего дерева, а не для реакции на изменение selectedConcept.
        // Чтение selectedConcept происходит для того, чтобы обновить его *после* загрузки данных.
        // Добавление selectedConcept в зависимости вызвало бы перезагрузку дерева при каждом выборе
        // концепта или при обновлении selectedConcept внутри этого же эффекта, что привело бы к лишним запросам или циклам.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshTree, setTaxonomyData]);

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

    const handleSearchChange = (newValue) => {
        setSearchQuery(newValue);
    };


    return (
        <div className="h-screen flex flex-col [background-image:linear-gradient(117deg,_#707E87_0%,_#939DA6_100%)]">
            <EditorHeader
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                onExport={() => setShowExportModal(true)}
                onClose={() => setShowCloseConfirmationModal(true)}
            />
            <div className="flex px-18 py-0 justify-center items-start gap-6 h-[calc(100%_-_112px)]">

                <TreeView
                    treeData={treeData}
                    refreshTaxonomyTree={refreshTaxonomyTree}
                    onSelect={handleConceptSelect}
                    loading={loading}
                    searchQuery={searchQuery}
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