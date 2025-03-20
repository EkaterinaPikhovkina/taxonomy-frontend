import ConceptDetails from './ConceptDetails';
import TreeView from "./visualisation/TreeView.jsx";
import {useEffect, useState} from "react";
import { fetchTaxonomyTree, exportTaxonomy } from '../services/api';
import EditorHeader from "./headers/EditorHeader.jsx";


function TaxonomyEditor({ taxonomyData, setTaxonomyData }) {
    const [selectedConcept, setSelectedConcept] = useState(null);
    const [treeData, setTreeData] = useState([]); // Стан для даних дерева
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     const loadTaxonomy = async () => {
    //         setLoading(true);
    //         try {
    //             const data = await fetchTaxonomyTree();
    //             if (data && data.length > 0) {
    //                 setTreeData(data);
    //                 setTaxonomyData(data);
    //             } else {
    //                 setTaxonomyData([]);
    //             }
    //         } catch (error) {
    //             console.error("Ошибка при загрузке таксономии:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //
    //     if (!taxonomyData || taxonomyData.length === 0) {
    //         loadTaxonomy();
    //     } else {
    //         setTreeData(taxonomyData);
    //         setLoading(false);
    //         if (taxonomyData.length > 0) {
    //             setSelectedConcept(taxonomyData[0]);
    //         }
    //     }
    // }, []);
    //
    // const handleConceptSelect = (concept) => {
    //     setSelectedConcept(concept);
    // };

    useEffect(() => {
        const loadTaxonomy = async () => {
            setLoading(true);
            try {
                const data = await fetchTaxonomyTree();
                if (data && data.length > 0) {
                    setTreeData(data);
                    setTaxonomyData(data);
                    if (data.length > 0) {
                        setSelectedConcept(data[0]);  // Ініціалізуємо selectedConcept першим елементом
                    }
                } else {
                    setTaxonomyData([]);
                }
            } catch (error) {
                console.error("Ошибка при загрузке таксономии:", error);
            } finally {
                setLoading(false);
            }
        };
        if (!taxonomyData || taxonomyData.length === 0) {
            loadTaxonomy();
        } else {
            setTreeData(taxonomyData);
            setLoading(false);
            if (taxonomyData.length > 0) {
                setSelectedConcept(taxonomyData[0]); // І тут теж
            }
        }

    }, []);

    const handleConceptSelect = (concept) => {
        setSelectedConcept(concept); // Приймаємо і встановлюємо сам об'єкт концепту
    };

    useEffect(() => {
        if(taxonomyData){
            //робимо щось, якщо потрібно оновити локальні дані. наприклад, скидаємо selectedConcept
        }
    },[taxonomyData])

    const handleExport = async (format) => { // Додаємо обробник експорту
        try {
            await exportTaxonomy(format);
        } catch (error) {
            console.error("Помилка при експорті таксономії:", error);
            alert("Помилка при експорті таксономії. Перевірте консоль.");
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            <EditorHeader onExport={handleExport} />
            <div className="flex px-18 py-0 justify-center items-start gap-6 h-full">
                <div className="flex flex-col justify-between items-start w-[416px] pt-8 bg-white h-full">
                    <TreeView
                        treeData={treeData}
                        onSelect={handleConceptSelect}
                        loading={loading}
                    />
                </div>
                <div className="flex flex-col items-start gap-6 px-6 py-8 flex-1 h-full bg-white">
                    <ConceptDetails
                        concept={selectedConcept}
                        setTaxonomyData={setTaxonomyData}
                        taxonomyData={taxonomyData}
                    />
                </div>
            </div>
        </div>
    );
}

export default TaxonomyEditor;