import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./Graph.css";

function Graph() {
    // define references
    const svgRef = useRef();
    const gRef = useRef();

    // define state data
    const [data, setData] = useState(null);

    // create simulation
    const simulation = d3.forceSimulation();

    // collision behaviour
    const collisionBehaviour = d3
        .forceCollide()
        .radius(function (node) {
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
        node.fy = event.y;
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
                .force(
                    "link",
                    linkBehaviour.links(data.edges)
                )
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
                        return edge.source.y;
                    })
                    .attr("x2", function (edge) {
                        return edge.target.x;
                    })
                    .attr("y2", function (edge) {
                        return edge.target.y;
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
                        return node.y;
                    })
                    .style("fill", function (node) {
                        return node.color;
                    })
                    .call(dragBehaviour);
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
