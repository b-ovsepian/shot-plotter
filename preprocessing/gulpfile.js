const { parallel, series, src, dest } = require("gulp");
const gulpif = require("gulp-if");
const preprocess = require("gulp-preprocess");
const rename = require("gulp-rename");
const inject = require("gulp-inject");
const del = require("del");
const sports = require("../supported-sports.json").sports;
const fs = require("fs-extra");

const indexBanner = false;
const banner = false;
const analytics = false;

function html(sport) {
    return src("./base.html")
        .pipe(preprocess({ context: { SPORT: sport } })) // set environment variables in-line
        .pipe(
            inject(src([`../resources/${sport}.svg`]), {
                starttag: "<!-- inject:playingarea -->",
                transform: function (filePath, file) {
                    // return file contents as string
                    return file.contents.toString("utf8");
                },
            })
        )
        .pipe(
            gulpif(
                banner,
                inject(src(`./banner.html`), {
                    starttag: "<!-- inject:banner -->",
                    transform: function (filePath, file) {
                        // return file contents as string
                        return file.contents.toString("utf8");
                    },
                })
            )
        )
        .pipe(
            gulpif(
                analytics,
                inject(src(`./analytics.html`), {
                    starttag: "<!-- inject:analytics -->",
                    transform: function (filePath, file) {
                        // return file contents as string
                        return file.contents.toString("utf8");
                    },
                })
            )
        )
        .pipe(rename(`${sport}.html`))
        .pipe(dest("../html"));
}

function card(sport) {
    return src("./card.html")
        .pipe(
            preprocess({
                context: {
                    ID: sport.id,
                    NAME: sport.name,
                    DIMS: sport.dimensions,
                    UNITS: sport.units,
                    SPECS: sport.specifications,
                },
            })
        ) // set environment variables in-line
        .pipe(
            inject(src([`../resources/${sport.id}.svg`]), {
                starttag: "<!-- inject:cardplayingarea -->",
                transform: function (filePath, file) {
                    // return file contents as string
                    return file.contents.toString("utf8");
                },
            })
        )
        .pipe(rename(`${sport.id}-card.html`))
        .pipe(dest("./card"));
}

function index() {
    const filePaths = sports
        .filter((s) => !s.private)
        .map((sport) => `./card/${sport.id}-card.html`);
    return src("./index-base.html")
        .pipe(
            inject(src(filePaths), {
                starttag: `<!-- inject:cards -->`,
                transform: function (filePath, file) {
                    // return file contents as string
                    return file.contents.toString("utf8");
                },
            })
        )
        .pipe(
            gulpif(
                banner || indexBanner,
                inject(src(`./banner.html`), {
                    starttag: "<!-- inject:banner -->",
                    transform: function (filePath, file) {
                        // return file contents as string
                        return file.contents.toString("utf8");
                    },
                })
            )
        )
        .pipe(
            gulpif(
                analytics,
                inject(src(`./analytics.html`), {
                    starttag: "<!-- inject:analytics -->",
                    transform: function (filePath, file) {
                        // return file contents as string
                        return file.contents.toString("utf8");
                    },
                })
            )
        )
        .pipe(rename(`index.html`))
        .pipe(dest("../html"));
}

function clean() {
    return del(["./card"]);
}

function createPublicDir() {
    return fs.ensureDir("../public");
}

function copyHtmlFiles() {
    return src("../html/**/*.html").pipe(dest("../public"));
}

function copyCss() {
    return src("../index.css").pipe(dest("../public"));
}

function copySetup() {
    return src("../setup.js").pipe(dest("../public"));
}

function copyJson() {
    return src("../supported-sports.json").pipe(dest("../public"));
}

function copyJs() {
    return src("../js/**/*").pipe(dest("../public/js"));
}

function copyResources() {
    return src("../resources/**/*").pipe(dest("../public/resources"));
}

function cleanBuild() {
    return del(["../public/**", "!../public"], { force: true });
}

function start() {
    return parallel(
        sports.map((sport) => () => html(sport.id)),
        series(parallel(sports.map((sport) => () => card(sport))), index, clean)
    );
}

function build() {
    return series(
        parallel(
            sports.map((sport) => () => html(sport.id)),
            series(
                parallel(sports.map((sport) => () => card(sport))),
                index,
                clean
            )
        ),
        cleanBuild,
        createPublicDir,
        parallel(
            copyHtmlFiles,
            copyCss,
            copySetup,
            copyJs,
            copyResources,
            copyJson
        )
    );
}

exports.build = build();
exports.default = start();
