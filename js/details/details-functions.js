function getDetails() {
    return JSON.parse(sessionStorage.getItem("details"));
}

function setDetails(detailsList) {
    sessionStorage.setItem("details", JSON.stringify(detailsList));
}

function existsDetail(id) {
    return !d3.select(id).empty();
}

function getCurrentShotTypes() {
    var options = [];
    if (existsDetail("#shot-type")) {
        d3.select("#shot-type-select")
            .selectAll("option")
            .each(function() {
                let obj = {
                    value: d3.select(this).property("value"),
                };
                if (
                    d3.select("#shot-type-select").property("value") ===
                    obj.value
                ) {
                    obj["selected"] = true;
                }

                options.push(obj);
            });
    }
    return options;
}

function changePage(currentPageId, newPageId) {
    d3.select(currentPageId).attr("hidden", true);
    d3.select(newPageId).attr("hidden", null);
}

export {
    getDetails,
    setDetails,
    existsDetail,
    getCurrentShotTypes,
    changePage,
};
