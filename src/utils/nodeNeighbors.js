export function findNodeNeighbors(node, edges) {
    const neighbors = edges
        .filter(function (edge) {
            //console.log(edge);
            return edge.source.id === node.id || edge.target.id === node.id;
        })
        .flatMap(function (edge) {
            if (edge.source.id === node.id) {
                return edge.target;
            } else {
                return edge.source;
            }
        });

    return neighbors;
}
