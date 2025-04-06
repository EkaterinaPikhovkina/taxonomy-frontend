import React, {useState} from 'react';
import TreeNode from './TreeNode';

function TreeView({treeData, onSelect, loading}) {
    const [expandedNodes, setExpandedNodes] = useState(new Set());
    const [selectedNodeKey, setSelectedNodeKey] = useState(null);

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

    if (loading) {
        return <div className="px-6">Завантаження таксономії...</div>;
    }

    if (!treeData || treeData.length === 0) {
        return <div className="px-6">Немає даних для відображення.</div>;
    }

    return (
        <div className="overflow-auto w-full">
            <div className="flex flex-col px-6 pb-8 gap-2">
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
    );
}

export default TreeView;