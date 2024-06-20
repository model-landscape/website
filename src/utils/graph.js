import * as d3 from "d3";

export function getInitialGraphTransform(svg, group) {
    // get svg dimensions
    const svgRect = svg.getBoundingClientRect();
    const svgWidth = svgRect.width;
    const svgHeight = svgRect.height;

    // get content dimensions
    const groupBBox = group.getBBox();
    const groupWidth = groupBBox.width;
    const groupHeight = groupBBox.height;
    const groupX = groupBBox.x;
    const groupY = groupBBox.y;

    // calculate scaling factor
    const scaleX = svgWidth / groupWidth;
    const scaleY = svgHeight / groupHeight;
    const scale = Math.min(scaleX, scaleY); // Uniform scale to maintain aspect ratio

    // calculate translation
    const translateX = (svgWidth - groupWidth * scale) / 2 - groupX * scale;
    const translateY = (svgHeight - groupHeight * scale) / 2 - groupY * scale;

    // create transform matrix
    const initialTransformMatrix = d3.zoomIdentity
        .translate(translateX, translateY)
        .scale(scale);

    return initialTransformMatrix;
}
