import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { getInitialGraphTransform } from "../utils/graph";
import "./Graph.css";
import Modal from "./ui/Modal";

function Graph({ gephiData, gephiIOData }) {
    const svgRef = useRef(null);
    const transformGroupRef = useRef(null);
    const scaleRef = useRef(1);
    const isEnterRef = useRef(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clickedNode, setClickedNode] = useState(null);
    const [clickedNodeInfo, setClickedNodeInfo] = useState(null);

    const nodes = gephiData.nodes;
    const edges = gephiData.edges;

    const sortedNodes = useMemo(() => {
        return nodes.slice().sort((a, b) => b.size - a.size);
    }, [nodes]);

    const oneRem = useMemo(() => {
        return parseFloat(getComputedStyle(document.documentElement).fontSize);
    }, []);

    const handleZoom = (event) => {
        const transformMatrix = event.transform;
        d3.select(transformGroupRef.current).attr("transform", transformMatrix);

        const scalingFactor = event.transform.k;
        scaleRef.current = scalingFactor;

        d3.selectAll(".label").attr("font-size", () => oneRem / scalingFactor);

        if (!isEnterRef.current) {
            const numberOfVisibleLabels = Math.floor(
                scalingFactor * sortedNodes.length
            );

            d3.selectAll(".label").style("opacity", (node) => {
                const nodeIndex = sortedNodes.findIndex(
                    (sortedNode) => sortedNode.id === node.id
                );
                return nodeIndex < numberOfVisibleLabels ? 1 : 0;
            });
        }
    };

    const zoom = d3.zoom().on("zoom", handleZoom);

    const handleMouseEnter = (_, node) => {
        isEnterRef.current = true;

        // Find neighboring nodes
        const neighbors = edges.filter(
            (edge) => edge.source === node.id || edge.target === node.id
        );
        const neighboringNodeIDs = [
            ...neighbors.map((edge) => edge.source),
            ...neighbors.map((edge) => edge.target),
        ];

        // Adjust opacity and size of nodes
        d3.selectAll(".node")
            .style("opacity", (d) =>
                neighboringNodeIDs.includes(d.id) ? 1 : 0.2
            )
            .attr("r", (d) =>
                neighboringNodeIDs.includes(d.id) ? d.size * 1.5 : d.size
            );

        d3.selectAll(".label")
            .attr("transform", (d) => {
                if (neighboringNodeIDs.includes(d.id)) {
                    const translateY = d.size * 1.5 - d.size;
                    return `translate(0,${translateY})`;
                }
            })
            .style("opacity", (d) =>
                neighboringNodeIDs.includes(d.id) ? 1 : 0
            );

        // Adjust opacity of edges
        d3.selectAll(".edge").style("opacity", (edge) =>
            neighboringNodeIDs.includes(edge.source) &&
            neighboringNodeIDs.includes(edge.target)
                ? 1
                : 0
        );
    };

    const handleMouseLeave = () => {
        isEnterRef.current = false;

        d3.selectAll(".node")
            .attr("r", (node) => node.size)
            .style("opacity", 1);
        d3.selectAll(".edge").style("opacity", 1);

        const scalingFactor = scaleRef.current;
        const numberOfVisibleLabels = Math.floor(
            scalingFactor * sortedNodes.length
        );

        d3.selectAll(".label")
            .attr("transform", "translate(0,0)")
            .style("opacity", (node) => {
                const nodeIndex = sortedNodes.findIndex(
                    (sortedNode) => sortedNode.id === node.id
                );
                return nodeIndex < numberOfVisibleLabels ? 1 : 0;
            });
    };

    const handleClick = (_, clickedNode) => {
        const clickedNodeIO = gephiIOData.filter(
            (nodeIO) => nodeIO.node === clickedNode.id
        )[0];

        if (clickedNodeIO) {
            setIsModalOpen(true);
            setClickedNode(clickedNode);
            setClickedNodeInfo(clickedNodeIO);
        }
    };

    useEffect(() => {
        const svg = d3.select(svgRef.current).call(zoom);
        const transformGroup = d3.select(transformGroupRef.current);

        transformGroup.selectAll("*").remove();

        const edgeGroup = transformGroup.append("g").classed("edges", true);
        edgeGroup
            .selectAll("line")
            .data(edges)
            .join("line")
            .classed("edge", true)
            .attr("x1", (edge) => nodes.find((n) => n.id === edge.source).x)
            .attr("y1", (edge) => -nodes.find((n) => n.id === edge.source).y)
            .attr("x2", (edge) => nodes.find((n) => n.id === edge.target).x)
            .attr("y2", (edge) => -nodes.find((n) => n.id === edge.target).y)
            .style("stroke", (edge) => edge.color)
            .style("stroke-width", (edge) => edge.size)
            .style("opacity", 1);

        const nodeGroup = transformGroup.append("g").classed("nodes", true);
        nodeGroup
            .selectAll("circle")
            .data(nodes, (node) => node.id)
            .join("circle")
            .classed("node", true)
            .attr("r", (node) => node.size)
            .attr("cx", (node) => node.x)
            .attr("cy", (node) => -node.y)
            .style("fill", (node) => node.color)
            .style("opacity", 1)
            .on("mouseenter", handleMouseEnter)
            .on("mouseleave", handleMouseLeave)
            .on("click", handleClick);

        const labelGroup = transformGroup.append("g").classed("labels", true);
        labelGroup
            .selectAll("text")
            .data(nodes)
            .join("text")
            .classed("label", true)
            .attr("x", (node) => node.x) // Adjust position as needed
            .attr("y", (node) => -node.y + node.size + 10) // Adjust position as needed
            .attr("dominant-baseline", "hanging")
            .style("opacity", 0)
            .text((node) => node.label);

        const initialTransformMatrix = getInitialGraphTransform(
            svgRef.current,
            transformGroupRef.current
        );

        svg.transition()
            .duration(1000)
            .call(zoom.transform, initialTransformMatrix);
    }, []);

    return (
        <div className="graph">
            <svg ref={svgRef}>
                <g ref={transformGroupRef}></g>
            </svg>
            {isModalOpen && (
                <Modal
                    node={clickedNode}
                    nodeInfo={clickedNodeInfo}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}
export default Graph;
