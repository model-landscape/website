export function findNodeById(id, nodes) {
    return nodes.find((node) => node.id === id);
}

export function getContentBounds(nodes) {
    const [minX, minY, maxX, maxY] = nodes.reduce(
        (acc, { x, y, size }) => [
            Math.min(acc[0], x - size),
            Math.min(acc[1], -y - size),
            Math.max(acc[2], x + size),
            Math.max(acc[3], -y + size),
        ],
        [Infinity, Infinity, -Infinity, -Infinity]
    );

    const width = maxX - minX;
    const height = maxY - minY;

    return { minX, maxX, minY, maxY, width, height };
}
