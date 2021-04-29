import { getDetails } from "../details/details.js";
import { createDot } from "./dot.js";
import { cfg } from "./config.js";

function setUpLegend() {
    var div = d3.select("#legend").append("div");
    div.append("div")
        .attr("class", "center")
        .append("svg")
        .attr("id", "shot-type-legend");

    shotTypeLegend();

    div.append("div")
        .attr("class", "center")
        .append("svg")
        .attr("id", "team-legend");

    teamLegend();
}

function shotTypeLegend(id = "#shot-type-legend") {
    var xOffset = 2 * cfg.legendR;
    var yOffset = 2 * cfg.legendR;
    var spacing = 2 * cfg.legendR;
    var svg = d3.select(id);

    // clear svg
    svg.selectAll("*").remove();

    // if shot-type not in the details
    if (!_.find(getDetails(), { id: "shot-type" })) {
        svg.attr("width", 0).attr("height", 0);
        return;
    }

    var typeOptions = _.find(getDetails(), { id: "shot-type" })["options"];

    for (let option of typeOptions) {
        var data = {
            teamId: true,
            player: "",
            type: option.value,
            coords: [xOffset, 0.625 * yOffset],
            id: xOffset,
            legendBool: true,
        };
        createDot(id, data);
        xOffset += spacing;
        xOffset +=
            svg
                .append("text")
                .attr("x", xOffset)
                .attr("y", yOffset)
                .text(option.value)
                .node()
                .getComputedTextLength() +
            2 * spacing;
    }

    svg.attr("width", xOffset).attr("height", 2 * yOffset);
}

function teamLegend(id = "#team-legend") {
    var xOffset = 2 * cfg.legendR;
    var yOffset = 2 * cfg.legendR;
    var spacing = 2 * cfg.legendR;
    var svg = d3.select(id);

    // clear svg
    svg.selectAll("*").remove();

    // do not do anything if team widget isn't present
    if (d3.select("#team").empty()) {
        svg.attr("width", 0).attr("height", 0);
        return;
    }

    for (let i of [
        ["blue-shot", d3.select("#blue-team-name").property("value")],
        ["orange-shot", d3.select("#orange-team-name").property("value")],
    ]) {
        svg.append("rect")
            .attr("x", xOffset - cfg.legendR)
            .attr("y", 0.25 * yOffset)
            .attr("width", 2 * cfg.legendR)
            .attr("height", 2 * cfg.legendR)
            .attr("class", i[0])
            .style("stroke-width", "0.02em");
        xOffset += spacing;
        xOffset +=
            svg
                .append("text")
                .attr("x", xOffset)
                .attr("y", yOffset)
                .text(i[1])
                .node()
                .getComputedTextLength() +
            2 * spacing;
    }
    svg.attr("width", xOffset).attr("height", 2 * yOffset);
}

export { setUpLegend, shotTypeLegend, teamLegend };
