export function findNodeById(id, nodes) {
    return nodes.find((node) => node.id === id);
}

export function getGephiContentLimits(nodes) {
    const [minX, minY, maxX, maxY] = nodes.reduce(
        (acc, { x, y, size }) => [
            Math.min(acc[0], x - size),
            Math.min(acc[1], -y - size),
            Math.max(acc[2], x + size),
            Math.max(acc[3], -y + size),
        ],
        [Infinity, Infinity, -Infinity, -Infinity]
    );

    return { minX, maxX, minY, maxY };
}
