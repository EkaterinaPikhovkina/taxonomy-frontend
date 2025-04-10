import React, {useEffect, useMemo, useState} from 'react';
import TreeNode from './TreeNode';
import NewTopConceptModal from "../modals/NewTopConceptModal.jsx";
import DefaultButton from "../buttons/DefaultButton.jsx";
import {addTopConcept} from "../../services/api.js";

const filterTree = (nodes, query) => {
    if (!query) {
        return nodes; // Return original nodes if query is empty
    }
    const lowerCaseQuery = query.toLowerCase();

    function filterNode(node) {
        // Check if the current node's title matches
        const nodeMatches = node.title.toLowerCase().includes(lowerCaseQuery);

        // Recursively filter children
        const filteredChildren = (node.children || [])
            .map(filterNode) // Filter descendants
            .filter(child => child !== null); // Remove null results (nodes that didn't match and had no matching children)

        // Keep the node if it matches directly OR if any of its children matched
        if (nodeMatches || filteredChildren.length > 0) {
            // Return a copy of the node with potentially filtered children
            // Crucially, even if the node itself doesn't match, we keep it if children match
            return { ...node, children: filteredChildren };
        }

        // Discard the node if neither it nor any descendant matched
        return null;
    }

    // Apply the filter function to top-level nodes and remove nulls
    return nodes.map(filterNode).filter(node => node !== null);
};

// Helper function to get all keys from a tree structure
const getAllKeys = (nodes) => {
    let keys = new Set();
    nodes.forEach(node => {
        keys.add(node.key);
        if (node.children && node.children.length > 0) {
            const childKeys = getAllKeys(node.children);
            childKeys.forEach(key => keys.add(key));
        }
    });
    return keys;
};

function TreeView({treeData, refreshTaxonomyTree, onSelect, loading, searchQuery}) {
    const [expandedNodes, setExpandedNodes] = useState(new Set());
    const [selectedNodeKey, setSelectedNodeKey] = useState(null);
    const [showNewConceptModal, setShowNewConceptModal] = useState(false);

    const filteredData = useMemo(() => {
        console.log("Filtering tree with query:", searchQuery);
        return filterTree(treeData, searchQuery);
    }, [treeData, searchQuery]);

    useEffect(() => {
        if (searchQuery && filteredData.length > 0) {
            // When a search query is active and yields results, expand all nodes in the filtered tree
            const allFilteredKeys = getAllKeys(filteredData);
            setExpandedNodes(allFilteredKeys);
        } else if (!searchQuery) {
            // Optional: Reset expansion when search is cleared, or leave as is
            // setExpandedNodes(new Set()); // Uncomment to collapse all when search is cleared
        }
        // Do not reset selection on search change, allow users to click results
        // setSelectedNodeKey(null);
    }, [searchQuery, filteredData]); // Rerun when query or filtered data changes


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
            console.log(`Top concept '${conceptData.conceptName}' successfully added`);
        } catch (error) {
            console.error("Error adding top concept:", error);
            alert("Error adding top concept. Check console.");
        } finally {
            setShowNewConceptModal(false);
        }
    };

    return (
        <div className="flex flex-col items-start pt-8 bg-white flex-1 h-full overflow-hidden">
            {loading ? (
                <div className="px-6 pb-2">Завантаження таксономії...</div>
            ) : (!treeData || treeData.length === 0) ? (
                <div className="px-6 pb-2">
                    Таксономія порожня. Додайте новий клас.
                </div>
            ) : (!filteredData || filteredData.length === 0) && searchQuery ? ( // Check filtered data when searching
                <div className="px-10 pb-2 text-gray-600">
                    Нічого не знайдено за запитом "{searchQuery}".
                </div>
            ): (
                <div className="w-full overflow-auto flex-grow">
                    <div className="flex flex-col pb-2 gap-2">
                        {filteredData.map((node) => (
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