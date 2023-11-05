import { dataStorage } from "../setup.js";
import { setRows, getRows, setFilteredRows } from "./table/table-functions.js";
import { updateTable } from "./table/table.js";

export let hls;
export let videoStartTime = 0;

export function setupVideo() {
    const videoUrl = document.getElementById("video-url");
    const videoRunBtn = document.getElementById("video-run-btn");
    const videoStartBtn = document.getElementById("video-start-btn");
    const videoSyncBtn = document.getElementById("video-sync-btn");

    videoStartTime = dataStorage.get("video-start-time") || 0;
    setVideoStartTimeText();

    videoRunBtn.addEventListener("click", () => {
        if (videoUrl.value) {
            runVideo(videoUrl.value);

            [videoStartBtn, videoSyncBtn].forEach((el) => {
                el.disabled = false;
            });

            videoStartBtn.addEventListener("click", () => {
                setVideoStartTime();
            });

            videoSyncBtn.addEventListener("click", () => {
                if (getRows()) {
                    setRows(
                        getRows().map(function (row) {
                            const { rowData } = row;
                            if (
                                rowData["video-time-input"] &&
                                rowData["v-time-input"]
                            ) {
                                const [minutes, seconds] =
                                    rowData["v-time-input"].split(":");
                                const time =
                                    parseInt(minutes) * 60 + parseInt(seconds);
                                const newTime = time + videoStartTime;
                                const newMinutes = Math.floor(newTime / 60);
                                const newSeconds = newTime - newMinutes * 60;
                                rowData[
                                    "video-time-input"
                                ] = `${newMinutes}:${newSeconds
                                    .toString()
                                    .padStart(2, "0")}`;
                                return row;
                            }
                        })
                    );
                    setFilteredRows(getRows());
                    updateTable();
                }
            });
        } else {
            alert("Please input video url");
        }
    });
}

function runVideo(url) {
    const video = document.getElementById("video");
    if (Hls.isSupported()) {
        hls = new Hls({
            debug: false,
        });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MEDIA_ATTACHED, function () {
            video.muted = true;
            video.currentTime = videoStartTime;
            // video.play();
        });
    }
    // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
    // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element through the `src` property.
    // This is using the built-in support of the plain video element, without using hls.js.
    else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
        video.addEventListener("canplay", function () {
            video.currentTime = videoStartTime;
            // video.play();
        });
    }
}

function setVideoStartTime() {
    videoStartTime = Math.floor(document.getElementById("video").currentTime);
    dataStorage.set("video-start-time", videoStartTime);
    setVideoStartTimeText();
}

function setVideoStartTimeText() {
    const videoStartTimeEl = document.getElementById("video-start-time");
    const minutes = Math.floor(videoStartTime / 60);
    const seconds = videoStartTime - minutes * 60;
    videoStartTimeEl.innerHTML = `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;
}
