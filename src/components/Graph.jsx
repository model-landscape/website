import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./Graph.css";
import { findNodeNeighbors } from "../utils/nodeNeighbors";

function Graph() {
    // define references
    const svgRef = useRef();
    const gRef = useRef();

    // define state data
    const [data, setData] = useState(null);

    // define constants
    const HOVER_SIZE_MULTIPLIKATOR = 1.2;
    const HOVER_TRANSITION_DURATION = 750;
    const HOVER_OPACITY = 0.1;

    // create simulation
    const simulation = d3.forceSimulation();

    // collision behaviour
    const collisionBehaviour = d3.forceCollide().radius(function (node) {
        return node.size;
    });

    // link behaviour
    const linkBehaviour = d3
        .forceLink()
        .strength(0)
        .id(function (node) {
            return node.id;
        });

    // define zoom behaviour
    const zoomBehaviour = d3.zoom().on("zoom", zoomed);
    function zoomed(event) {
        if (event.transform == null) {
            return;
        }
        const g = d3.select(gRef.current);
        g.attr("transform", event.transform);
    }

    // define drag behaviour
    const dragBehaviour = d3.drag().on("drag", dragged);
    function dragged(event, node) {
        node.fx = event.x;
        node.fy = -event.y;
        simulation.alpha(0.3).restart();
    }

    useEffect(function () {
        async function fetchData() {
            const res = await fetch("/gephi.json");
            if (!res.ok) {
                throw new Error("Error fetching data.");
            }
            const data = await res.json();

            setData(data);
        }

        fetchData();
    }, []);

    useEffect(
        function () {
            // check if data is populated
            if (data == null) {
                return;
            }

            // retrieve svg element
            const svg = d3.select(svgRef.current);

            // check svg for zoom events
            svg.call(zoomBehaviour);

            // retrieve group element
            const g = d3.select(gRef.current);

            // set forces
            simulation
                .nodes(data.nodes)
                .force("collision", collisionBehaviour)
                .force("link", linkBehaviour.links(data.edges))
                .on("tick", ticked);

            function ticked() {
                // populate edges
                g.selectAll("line")
                    .data(data.edges)
                    .join("line")
                    .classed("edge", true)
                    .attr("x1", function (edge) {
                        return edge.source.x;
                    })
                    .attr("y1", function (edge) {
                        return -edge.source.y;
                    })
                    .attr("x2", function (edge) {
                        return edge.target.x;
                    })
                    .attr("y2", function (edge) {
                        return -edge.target.y;
                    })
                    .style("stroke", function (edge) {
                        return edge.color;
                    })
                    .style("stroke-width", function (edge) {
                        return edge.size;
                    });

                // populate nodes
                g.selectAll("circle")
                    .data(data.nodes)
                    .join("circle")
                    .classed("node", true)
                    .attr("r", function (node) {
                        return node.size;
                    })
                    .attr("cx", function (node) {
                        return node.x;
                    })
                    .attr("cy", function (node) {
                        return -node.y;
                    })
                    .style("fill", function (node) {
                        return node.color;
                    })
                    .call(dragBehaviour)
                    .on("mouseover", function (event, node) {
                        console.log(node);
                        console.log(node.attributes);
                        const neighbors = findNodeNeighbors(node, data.edges);

                        const neighborElements = d3
                            .selectAll("circle")
                            .filter(function (node) {
                                return neighbors.includes(node);
                            });

                        const notNeighborElements = d3
                            .selectAll("circle")
                            .filter(function (node) {
                                return !neighbors.includes(node);
                            });

                        neighborElements
                            .transition()
                            .duration(HOVER_TRANSITION_DURATION)
                            .attr("r", function (node) {
                                return node.size * HOVER_SIZE_MULTIPLIKATOR;
                            });

                        notNeighborElements
                            .transition()
                            .duration(HOVER_TRANSITION_DURATION)
                            .style("opacity", HOVER_OPACITY);

                        d3.select(this)
                            .transition()
                            .duration(HOVER_TRANSITION_DURATION)
                            .attr("r", function (node) {
                                return node.size * HOVER_SIZE_MULTIPLIKATOR;
                            });
                    })
                    .on("mouseout", function (event, node) {
                        const neighbors = findNodeNeighbors(node, data.edges);

                        const neighborElements = d3
                            .selectAll("circle")
                            .filter(function (node) {
                                return neighbors.includes(node);
                            });

                        const notNeighborElements = d3
                            .selectAll("circle")
                            .filter(function (node) {
                                return !neighbors.includes(node);
                            });

                        neighborElements
                            .transition()
                            .duration(HOVER_TRANSITION_DURATION)
                            .attr("r", function (node) {
                                return node.size;
                            });

                        notNeighborElements
                            .transition()
                            .duration(HOVER_TRANSITION_DURATION)
                            .style("opacity", 1);

                        d3.select(this)
                            .transition()
                            .duration(HOVER_TRANSITION_DURATION)
                            .attr("r", function (node) {
                                return node.size;
                            });
                    });
            }
        },
        [data]
    );

    return (
        <svg className="graph" ref={svgRef}>
            <g className="transformation" ref={gRef}></g>
        </svg>
    );
}

export default Graph;
