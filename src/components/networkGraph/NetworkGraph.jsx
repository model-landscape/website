import { useLayoutEffect, useReducer, useRef, useState } from "react";
import "./NetworkGraph.css";
import Node from "./Node/Node";
import Edge from "./Edge";
import { findNodeById, getContentBounds } from "../../utils/utils";
import gephi from "../../data/gephi.json";

const TRANSFORM_STATE = {
    dragging: false,
    scale: 1,
    translate: {
        x: 0,
        y: 0,
    },
    startPosition: {
        x: 0,
        y: 0,
    },
};

function transformReducer(state, action) {
    switch (action.type) {
        case "fit":
            return {
                ...state,
                scale: action.scale,
                translate: action.translate,
            };
        case "start_drag":
            return {
                ...state,
                dragging: true,
                startPosition: action.startPosition,
            };
        case "stop_drag":
            return {
                ...state,
                dragging: false,
            };
        case "drag":
            return {
                ...state,
                translate: action.translate,
                startPosition: action.startPosition,
            };
        case "scale":
            return {
                ...state,
                scale: action.scale,
            };
        default:
            return state;
    }
}

function NetworkGraph() {
    const [state, dispatch] = useReducer(transformReducer, TRANSFORM_STATE);
    //const [nodeSelection, setNodeSelection] = useState([null]);

    const graphRef = useRef(null);

    useLayoutEffect(() => {
        const graph = graphRef.current;
        const graphBounds = graph.getBoundingClientRect();
        const contentBounds = getContentBounds(gephi.nodes);

        const scaleX = graphBounds.width / contentBounds.width;
        const scaleY = graphBounds.height / contentBounds.height;

        const newScale = Math.min(scaleX, scaleY);

        const offsetX =
            (graphBounds.width / newScale - contentBounds.width) / 2;
        const offsetY =
            (graphBounds.height / newScale - contentBounds.height) / 2;

        const newTranslate = {
            x: -contentBounds.minX + offsetX,
            y: -contentBounds.minY + offsetY,
        };

        dispatch({ type: "fit", scale: newScale, translate: newTranslate });
    }, []);

    function handleMouseDown(event) {
        const newMouseStart = {
            x: event.pageX,
            y: event.pageY,
        };
        dispatch({ type: "start_drag", startPosition: newMouseStart });
    }

    function handleMouseUp() {
        dispatch({ type: "stop_drag" });
    }

    function handleMouseMove(event) {
        if (!state.dragging) return;

        const deltaX = (event.pageX - state.startPosition.x) / state.scale;
        const deltaY = (event.pageY - state.startPosition.y) / state.scale;

        const newTranslate = {
            x: deltaX + state.translate.x,
            y: deltaY + state.translate.y,
        };

        const newMouseStart = {
            x: event.pageX,
            y: event.pageY,
        };

        dispatch({
            type: "drag",
            translate: newTranslate,
            startPosition: newMouseStart,
        });
    }

    function handleWheel(event) {
        const delta = event.deltaY;
        const newScale = state.scale * Math.pow(1.1, delta / 360);
        dispatch({ type: "scale", scale: newScale });
    }

    /*
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
    */

    return (
        <div className="graph" ref={graphRef}>
            <svg
                //ref={svgRef}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onWheel={handleWheel}
                xmlns="http://www.w3.org/2000/svg"
            >
                <g
                    transform={`scale(${state.scale}) translate(${state.translate.x},${state.translate.y})`}
                >
                    {gephi.edges.map((edge, index) => {
                        const source = findNodeById(edge.source, gephi.nodes);
                        const target = findNodeById(edge.target, gephi.nodes);

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
                    {gephi.nodes.map((node, index) => {
                        //const selected = nodeSelection.includes(node.id);
                        return (
                            <Node
                                key={index}
                                node={node}
                                //selected={selected}
                                //onSelection={handleNodeSelection}
                            />
                        );
                    })}
                </g>
            </svg>
        </div>
    );
}

export default NetworkGraph;
