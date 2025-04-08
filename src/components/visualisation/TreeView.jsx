import React, {useState} from 'react';
import TreeNode from './TreeNode';
import NewTopConceptModal from "../modals/NewTopConceptModal.jsx";
import DefaultButton from "../buttons/DefaultButton.jsx";
import {addTopConcept} from "../../services/api.js";

function TreeView({treeData, refreshTaxonomyTree, onSelect, loading}) {
    const [expandedNodes, setExpandedNodes] = useState(new Set());
    const [selectedNodeKey, setSelectedNodeKey] = useState(null);
    const [showNewConceptModal, setShowNewConceptModal] = useState(false);

    const toggleNode = (key) => {
        const newExpandedNodes = new Set(expandedNodes);
        if (newExpandedNodes.has(key)) {
            newExpandedNodes.delete(key);
        } else {
            newExpandedNodes.add(key);
        }
        setExpandedNodes(newExpandedNodes);
    };

    const handleSelect = (key, nodeData) => {
        setSelectedNodeKey(key);
        console.log("TreeView handleSelect:", nodeData.node.title, key);
        onSelect(nodeData.node);
    };

    const addTopLevelConcept = async (conceptData) => {
        try {
            await addTopConcept(conceptData.conceptName, conceptData.definition);
            refreshTaxonomyTree();
            alert(`Top concept '${conceptData.conceptName}' successfully added`);
        } catch (error) {
            console.error("Error adding top concept:", error);
            alert("Error adding top concept. Check console.");
        } finally {
            setShowNewConceptModal(false);
        }
    };

    return (
        <div className="flex flex-col items-start pt-8 bg-white flex-1 h-full">
            {loading ? (
                <div className="px-6 pb-2">Завантаження таксономії...</div>
            ) : (!treeData || treeData.length === 0) ? (
                <div className="px-6 pb-2">
                    Немає даних для відображення.
                </div>
            ) : (
                <div className="overflow-auto w-full">
                    <div className="flex flex-col pb-2 gap-2">
                        {treeData.map((node) => (
                            <TreeNode
                                key={node.key}
                                node={node}
                                onSelect={handleSelect}
                                level={0}
                                expandedNodes={expandedNodes}
                                toggleNode={toggleNode}
                                selectedNodeKey={selectedNodeKey}
                            />
                        ))}
                    </div>
                </div>
            )}

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
    );
}

export default TreeView;