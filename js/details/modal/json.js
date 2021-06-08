import { saveCurrentDetailSetup } from "../details-functions.js";
import { downloadArea, uploadArea } from "../../components/upload-download.js";

function setUpJSONDownloadUpload(id) {
    // Custom Filename
    downloadArea(id, "custom-details", () => downloadJSON(id), ".json");
    uploadArea(
        id,
        "json-upload",
        e => uploadJSON(id, "#json-upload", e),
        "Only .json files are allowed."
    );
}

function downloadJSON(id) {
    var fileName = d3
        .select(id)
        .select(".download-name")
        .property("value");
    if (!fileName) {
        fileName =
            d3
                .select(id)
                .select(".download-name")
                .attr("placeholder") + ".json";
    }
    saveCurrentDetailSetup();
    download(
        JSON.stringify(getDetails(), null, 2),
        fileName,
        "application/json"
    );
}

function uploadJSON(id, uploadId, e) {
    if (/.json$/i.exec(d3.select(uploadId).property("value"))) {
        var f = e.target.files[0];
        if (f) {
            // change text and wipe value to allow for same file upload
            // while preserving name
            d3.select(id)
                .select(".upload-name-text")
                .text(f.name);
            d3.select(id)
                .select(".upload")
                .property("value", "");
            // TODO: some actual input sanitization
            f.text().then(function(text) {
                setDetails(JSON.parse(text));
                createReorderColumns("#main-page-mb");
            });
        }
    } else {
        d3.select(id)
            .select("#json-upload")
            .attr("class", "form-control is-invalid");
    }
}

export { setUpJSONDownloadUpload };
