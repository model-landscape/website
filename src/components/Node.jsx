import { useEffect, useState } from "react";
import "./Node.css";

function Node({ node, selected, onSelection }) {
    const [radius, setRadius] = useState(null);
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        setRadius(node.size);
    }, []);

    useEffect(() => {
        const newRadius = selected ? node.size * 1.5 : node.size;
        setRadius(newRadius);

        const newOpacity = selected ? 1 : 0.2;
        setOpacity(newOpacity);
    }, [selected]);

    function handleMouseEnter() {
        onSelection(node.id);
    }

    function handleMouseLeave() {
        onSelection(null);
    }

    return (
        <circle
            className="node"
            cx={node.x}
            cy={-node.y}
            r={radius}
            fill={node.color}
            opacity={opacity}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        />
    );
}

export default Node;
