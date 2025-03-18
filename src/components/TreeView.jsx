import React, { useState } from 'react';

function TreeNode({ node, onSelect, level, expandedNodes, toggleNode }) {
    const [isExpanded, setIsExpanded] = useState(expandedNodes.has(node.key)); // Використовуємо Set для ефективності

    const handleToggle = (e) => {
        e.stopPropagation(); // Зупиняємо спливання події, щоб клік на "+" не виділяв вузол
        setIsExpanded(!isExpanded);
        toggleNode(node.key);
    };

    const handleSelect = () => {
        onSelect(node.key, { node }); // Передаємо дані про вузол у форматі, схожому на Ant Design
    };

    const hasChildren = node.children && node.children.length > 0;

    return (
        <div
            className={`tree-node level-${level}`}
            style={{ marginLeft: `${level * 20}px` }} // Відступ залежно від рівня вкладеності
            onClick={handleSelect}
        >
            {hasChildren && (
                <span className="toggle-icon" onClick={handleToggle}>
          {isExpanded ? '-' : '+'}
        </span>
            )}
            <span className="node-title">{node.title}</span>
            {isExpanded && hasChildren && (
                <div className="children">
                    {node.children.map((child) => (
                        <TreeNode
                            key={child.key}
                            node={child}
                            onSelect={onSelect}
                            level={level + 1}
                            expandedNodes={expandedNodes}
                            toggleNode={toggleNode}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function TreeView({ treeData, onSelect, loading }) {
    const [expandedNodes, setExpandedNodes] = useState(new Set());

    const toggleNode = (key) => {
        const newExpandedNodes = new Set(expandedNodes);
        if (newExpandedNodes.has(key)) {
            newExpandedNodes.delete(key);
        } else {
            newExpandedNodes.add(key);
        }
        setExpandedNodes(newExpandedNodes);
    };

    if (loading) {
        return <div>Завантаження таксономії...</div>;
    }

    if (!treeData || treeData.length === 0) {
        return <div>Немає даних для відображення.</div>;
    }

    return (
        <div className="tree-view">
            {treeData.map((node) => (
                <TreeNode
                    key={node.key}
                    node={node}
                    onSelect={onSelect}
                    level={0} // Початковий рівень вкладеності
                    expandedNodes={expandedNodes}
                    toggleNode={toggleNode}
                />
            ))}
        </div>
    );
}

export default TreeView;