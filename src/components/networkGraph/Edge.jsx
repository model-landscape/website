function Edge({ edge, source, target }) {
    return (
        <line
            className="edge"
            x1={source.x}
            y1={-source.y}
            x2={target.x}
            y2={-target.y}
            stroke={edge.color}
            strokeWidth={edge.size}
        />
    );
}

export default Edge;
