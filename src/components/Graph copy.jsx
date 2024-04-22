import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./Graph.css";

function Graph() {
    const svgRef = useRef();
    const gRef = useRef();

    const [data, setData] = useState(null);
    const [transform, setTransform] = useState(null);

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
            if (data == null) {
                return;
            }

            const svg = d3.select(svgRef.current);

            svg.call(d3.zoom().on("zoom", zoomed));

            function zoomed(event) {
                setTransform(event.transform);
            }

            const g = d3.select(gRef.current);

            const svgDimension = svgRef.current.getBoundingClientRect();
            const svgWidth = svgDimension.width;
            const svgHeight = svgDimension.height;

            const simulation = d3
                .forceSimulation(data.nodes)
                .force("charge", d3.forceManyBody().strength(-200))
                .force("center", d3.forceCenter(svgWidth / 2, svgHeight / 2))
                .force(
                    "collision",
                    d3.forceCollide().radius(function (d) {
                        return d.size;
                    })
                )
                .force(
                    "link",
                    d3
                        .forceLink()
                        .links(data.edges)
                        .id(function (d) {
                            return d.id;
                        })
                )
                .on("tick", ticked);

            function ticked() {
                g.selectAll("line")
                    .data(data.edges)
                    .join("line")
                    .attr("x1", function (d) {
                        return d.source.x;
                    })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    })
                    .style("stroke", function (d) {
                        return d.color;
                    })
                    .style("stroke-width", function (d) {
                        return d.size;
                    });

                g.selectAll("circle")
                    .data(data.nodes)
                    .join("circle")
                    .attr("r", function (d) {
                        return d.size;
                    })
                    .attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    })
                    .style("fill", function (d) {
                        return d.color;
                    })
                    .call(d3.drag().on("drag", dragged));

                function dragged(event, d) {
                    d.vx = event.dx;
                    d.vy = event.dy;

                    simulation.alpha(0.3).restart();
                }
            }
        },
        [data]
    );

    useEffect(
        function () {
            if (transform == null) {
                return;
            }
            const g = d3.select(gRef.current);
            g.attr("transform", transform);
        },
        [transform]
    );

    return (
        <svg className="graph" ref={svgRef}>
            <g ref={gRef}></g>
        </svg>
    );
}

export default Graph;
