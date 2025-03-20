import React, { useState } from 'react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';

function TreeNode({ node, onSelect, level, expandedNodes, toggleNode, selectedNodeKey }) {
    const [isExpanded, setIsExpanded] = useState(expandedNodes.has(node.key));

    const handleToggle = (e) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
        toggleNode(node.key);
    };

    const handleSelect = () => {
        onSelect(node.key, { node });
    };

    const hasChildren = node.children && node.children.length > 0;
    const isSelected = node.key === selectedNodeKey;

    return (
        <div
            className={`tree-node level-${level} flex flex-col gap-2`}
            style={{ paddingLeft: `${level * 32}px` }}
            onClick={handleSelect}
        >
            <div className="flex items-center gap-4 cursor-pointer">
                {hasChildren && (
                    <span className="toggle-icon" onClick={handleToggle}>
                    {isExpanded ? <FaChevronDown/> : <FaChevronRight/>}
                </span>
                )}
                <span
                    className={`flex items-center px-4 py-1 rounded-md ${
                        isSelected ? "bg-blue text-white" : "bg-gray-100"
                    }`}
                >
                    {node.title}
                </span>
            </div>
            {isExpanded && hasChildren && (
                <div className="flex flex-col gap-2">
                    {node.children.map((child) => (
                        <TreeNode
                            key={child.key}
                            node={child}
                            onSelect={onSelect}
                            level={level + 1}
                            expandedNodes={expandedNodes}
                            toggleNode={toggleNode}
                            selectedNodeKey={selectedNodeKey}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default TreeNode;