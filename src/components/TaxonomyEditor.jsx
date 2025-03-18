import ConceptDetails from './ConceptDetails';
import TreeView from "./TreeView.jsx";
import {useEffect, useState} from "react";
import { fetchTaxonomyTree } from '../services/api';
import EditorHeader from "./headers/EditorHeader.jsx";


function TaxonomyEditor({ taxonomyData, setTaxonomyData }) {
    const [selectedConcept, setSelectedConcept] = useState(null);
    const [treeData, setTreeData] = useState([]); // Стан для даних дерева
    const [loading, setLoading] = useState(true);

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
                setSelectedConcept(taxonomyData[0]);
            }
        }
    }, []);

    // Функція для обробки кліку на концепті в дереві
    const handleConceptSelect = (concept) => {
        setSelectedConcept(concept);
    };

    //оновлення локального стану, коли приходять нові дані ззовні
    useEffect(() => {
        if(taxonomyData){
            //робимо щось, якщо потрібно оновити локальні дані. наприклад, скидаємо selectedConcept
        }
    },[taxonomyData])

    return (
        <div>
            <EditorHeader />
            <div className="editor-container">
                <div className="tree-container">
                    <TreeView
                        treeData={treeData}
                        onSelect={handleConceptSelect} // Передаємо обробник вибору
                        loading={loading} // Передаємо стан завантаження
                    />
                </div>
                <div className="details-container">
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