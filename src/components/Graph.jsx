import { useEffect, useRef, useState } from "react";
import "./Graph.css";
import Node from "./Node";
import Edge from "./Edge";
import { findNodeById, getContentBounds } from "../utils/utils";

function Graph({ nodes, edges }) {
    const [dragging, setDragging] = useState(false);
    const [scale, setScale] = useState(1);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const [mouseStart, setMouseStart] = useState({ x: 0, y: 0 });
    const [nodeSelection, setNodeSelection] = useState([null]);

    const svgRef = useRef(null);

    useEffect(() => {
        const svg = svgRef.current;
        const svgBounds = svg.getBoundingClientRect();
        const contentBounds = getContentBounds(nodes);

        const scaleX = svgBounds.width / contentBounds.width;
        const scaleY = svgBounds.height / contentBounds.height;

        const newScale = Math.min(scaleX, scaleY);

        const offsetX = (svgBounds.width / newScale - contentBounds.width) / 2;
        const offsetY =
            (svgBounds.height / newScale - contentBounds.height) / 2;

        const newTranslate = {
            x: -contentBounds.minX + offsetX,
            y: -contentBounds.minY + offsetY,
        };

        setScale(newScale);
        setTranslate(newTranslate);
    }, []);

    function handleMouseDown(event) {
        setDragging(true);
        const newMouseStart = {
            x: event.pageX,
            y: event.pageY,
        };
        setMouseStart(newMouseStart);
    }

    function handleMouseUp() {
        setDragging(false);
    }

    function handleMouseMove(event) {
        if (!dragging) return;

        const deltaX = (event.pageX - mouseStart.x) / scale;
        const deltaY = (event.pageY - mouseStart.y) / scale;

        const newTranslate = {
            x: deltaX + translate.x,
            y: deltaY + translate.y,
        };

        const newMouseStart = {
            x: event.pageX,
            y: event.pageY,
        };

        setTranslate(newTranslate);
        setMouseStart(newMouseStart);
    }

    function handleWheel(event) {
        const delta = event.deltaY;
        const newScale = scale * Math.pow(1.1, delta / 360);
        setScale(newScale);
    }

    function handleNodeSelection(nodeId) {
        if (!nodeId) {
            setNodeSelection([null]);
            return;
        }

        const neighboringEdges = edges.filter(
            (edge) => edge.source === nodeId || edge.target === nodeId
        );
        const neighboringNodes = neighboringEdges.map((edge) =>
            edge.source === nodeId ? edge.target : edge.source
        );

        const selection = neighboringNodes.concat(nodeId.toString());

        setNodeSelection(selection);
    }

    return (
        <div className="graph">
            <svg
                ref={svgRef}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onWheel={handleWheel}
                xmlns="http://www.w3.org/2000/svg"
            >
                <g
                    transform={`scale(${scale}) translate(${translate.x},${translate.y})`}
                >
                    {edges.map((edge, index) => {
                        const source = findNodeById(edge.source, nodes);
                        const target = findNodeById(edge.target, nodes);

                        if (!source || !target) return null;

                        return (
                            <Edge
                                key={index}
                                edge={edge}
                                source={source}
                                target={target}
                            />
                        );
                    })}
                    {nodes.map((node, index) => {
                        const selected = nodeSelection.includes(node.id);
                        return (
                            <Node
                                key={index}
                                node={node}
                                selected={selected}
                                onSelection={handleNodeSelection}
                            />
                        );
                    })}
                </g>
            </svg>
        </div>
    );
}

export default Graph;
