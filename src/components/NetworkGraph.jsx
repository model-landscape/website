import React, { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import data from "../data/gephi.json";
import "./NetworkGraph.css";

function NetworkGraph() {
    const svgRef = useRef(null);
    const gRef = useRef(null);
    const gNodesRef = useRef(null);
    const gEdgesRef = useRef(null);
    const gNodeBGsRef = useRef(null);
    const gNodeLabelsRef = useRef(null);
    const { nodes, edges } = data;

    console.log("render");

    const oneRem = useMemo(() => {
        return parseFloat(getComputedStyle(document.documentElement).fontSize);
    }, []);

    // Create a map of node IDs to neighbor node objects
    const neighborsMap = useMemo(() => {
        const map = new Map();
        nodes.forEach((node) => {
            map.set(node.id, []);
        });
        edges.forEach((edge) => {
            map.get(edge.source).push(edge.target);
            map.get(edge.target).push(edge.source);
        });
        return map;
    }, [nodes, edges]);

    // Function to find neighboring nodes
    const getNeighbors = (nodeId) => {
        const neighborIds = neighborsMap.get(nodeId);
        return nodes.filter((n) => neighborIds.includes(n.id));
    };

    const handleMouseEnter = (event, node) => {
        d3.select(`#node-${node.id}`).attr("r", node.size * 1.5);
        d3.select(`#node-label-${node.id}`).attr(
            "transform",
            `translate(0, ${node.size * 1.5 - node.size})`
        );

        // Enlarge neighboring nodes
        const neighbors = getNeighbors(node.id);
        neighbors.forEach((neighbor) => {
            d3.select(`#node-${neighbor.id}`).attr("r", neighbor.size * 1.5);
            d3.select(`#node-label-${neighbor.id}`).attr(
                "transform",
                `translate(0, ${neighbor.size * 1.5 - neighbor.size})`
            );
        });

        // Set opacity of non-neighboring nodes
        nodes.forEach((n) => {
            if (!neighbors.includes(n) && n.id !== node.id) {
                d3.select(`#node-${n.id}`).style("opacity", 0.2);
                d3.select(`#node-label-${n.id}`).style("opacity", 0);
            }
        });
        edges.forEach((edge) => {
            if (edge.source !== node.id && edge.target !== node.id) {
                d3.select(`#edge-${edge.id}`).style("opacity", 0);
            }
        });
    };

    const handleMouseLeave = (event, node) => {
        d3.select(`#node-${node.id}`).attr("r", node.size);
        d3.select(`#node-label-${node.id}`).attr(
            "transform",
            "translate(0, 0)"
        );

        // Reset neighboring nodes
        const neighbors = getNeighbors(node.id);
        neighbors.forEach((neighbor) => {
            d3.select(`#node-${neighbor.id}`).attr("r", neighbor.size);
            d3.select(`#node-label-${neighbor.id}`).attr(
                "transform",
                "translate(0, 0)"
            );
        });

        // Reset opacity of non-neighboring nodes
        nodes.forEach((n) => {
            d3.select(`#node-${n.id}`).style("opacity", 1);
            d3.select(`#node-label-${n.id}`).style("opacity", 1);
        });
        edges.forEach((edge) => {
            d3.select(`#edge-${edge.id}`).style("opacity", 1);
        });
    };

    const handleZoom = (e) => {
        d3.select(gRef.current).attr("transform", e.transform);
        d3.selectAll(`.node-label`).attr(
            "font-size",
            () => oneRem / e.transform.k
        );
    };
    const zoom = d3.zoom().scaleExtent([0.05, 1]).on("zoom", handleZoom);

    useEffect(() => {
        const gNodes = d3.select(gNodesRef.current);
        const gEdges = d3.select(gEdgesRef.current);
        const gNodeBGs = d3.select(gNodeBGsRef.current);
        const gNodeLabels = d3.select(gNodeLabelsRef.current);

        // Render edges
        gEdges
            .selectAll("line")
            .data(edges)
            .join("line")
            .classed("edge", true)
            .attr("id", (edge) => `edge-${edge.id}`)
            .attr("x1", (edge) => nodes.find((n) => n.id === edge.source).x)
            .attr("y1", (edge) => -nodes.find((n) => n.id === edge.source).y)
            .attr("x2", (edge) => nodes.find((n) => n.id === edge.target).x)
            .attr("y2", (edge) => -nodes.find((n) => n.id === edge.target).y)
            .style("stroke", (edge) => edge.color)
            .style("stroke-width", (edge) => edge.size)
            .style("opacity", 1);

        gNodeBGs
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .classed("node-bg", true)
            .attr("r", (node) => node.size)
            .attr("cx", (node) => node.x)
            .attr("cy", (node) => -node.y)
            .style("fill", "#e2e2e27a")
            .style("opacity", 1);

        gNodes
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .classed("node", true)
            .attr("id", (node) => `node-${node.id}`)
            .attr("r", (node) => node.size)
            .attr("cx", (node) => node.x)
            .attr("cy", (node) => -node.y)
            .style("fill", (node) => node.color)
            .style("opacity", 1)
            .on("mouseenter", handleMouseEnter)
            .on("mouseleave", handleMouseLeave);

        gNodeLabels
            .selectAll("text")
            .data(nodes)
            .join("text")
            .classed("node-label", true)
            .attr("id", (node) => `node-label-${node.id}`)
            .attr("x", (node) => node.x) // Adjust position as needed
            .attr("y", (node) => -node.y + node.size) // Adjust position as needed
            .attr("dominant-baseline", "hanging")
            .style("opacity", 1)
            .text((node) => node.label);

        const svg = d3.select(svgRef.current).call(zoom);
        const g = d3.select(gRef.current);

        // Calculate the bounding box of the content
        const bbox = g.node().getBBox();
        const width = svgRef.current.clientWidth;
        const height = svgRef.current.clientHeight;

        // Calculate scales to fit the content within the SVG container while maintaining aspect ratio
        const scaleX = width / bbox.width;
        const scaleY = height / bbox.height;
        const scale = Math.min(scaleX, scaleY); // Uniform scale to maintain aspect ratio

        // Calculate translation to center the content
        const translateX = (width - bbox.width * scale) / 2 - bbox.x * scale;
        const translateY = (height - bbox.height * scale) / 2 - bbox.y * scale;

        // Initial fit transform
        const initialTransform = d3.zoomIdentity
            .translate(translateX, translateY)
            .scale(scale);

        // Apply the initial transform
        svg.call(zoom.transform, initialTransform);
    }, []);

    return (
        <div className="graph">
            <svg ref={svgRef}>
                <g ref={gRef}>
                    <g className="edges" ref={gEdgesRef}></g>
                    <g className="node-bgs" ref={gNodeBGsRef}></g>
                    <g className="nodes" ref={gNodesRef}></g>
                    <g className="node-labels" ref={gNodeLabelsRef}></g>
                </g>
            </svg>
        </div>
    );
}
export default NetworkGraph;
