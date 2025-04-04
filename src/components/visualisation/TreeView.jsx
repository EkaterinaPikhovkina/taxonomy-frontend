import React, { useState } from 'react';
import TreeNode from './TreeNode';

function TreeView({ treeData, onSelect, loading }) {
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

    const handleSelect = (key, nodeData) => { // Приймаємо nodeData
        setSelectedNodeKey(key);
        onSelect(nodeData.node); // Передаємо сам об'єкт вузла, а не ключ!
    };

    if (loading) {
        return <div>Завантаження таксономії...</div>;
    }

    if (!treeData || treeData.length === 0) {
        return <div className="pl-6">Немає даних для відображення.</div>;
    }

    return (
        <div className="flex flex-col pl-6 gap-2">
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
    );
}

export default TreeView;