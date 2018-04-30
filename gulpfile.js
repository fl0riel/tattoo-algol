"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var posthtml = require("gulp-posthtml");
var includehtml = require("posthtml-include");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var minify = require("gulp-csso");
var uglify = require("gulp-uglify");
var htmlmin = require("gulp-htmlmin");
var concat = require("gulp-concat");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var removefill = require("remove-svg-properties").stream;
var rename = require("gulp-rename");
var run = require("run-sequence");
var del = require("del");
var server = require("browser-sync").create();

gulp.task("style", function() {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("css"))
    .pipe(server.stream());
});

gulp.task("svg", function() {
  return gulp.src("img/sprite/*.svg")
    .pipe(rsp.remove({
      properties: [rsp.PROPS_FILL, 'class', 'data-name', 'opacity', 'width', 'height', 'id']
    }))
    .pipe(gulp.dest("img/sprite"));
});

gulp.task("svg2", function () {
  return gulp.src("img/sprite/*.svg")
    .pipe(svgstore({
        inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(removefill.remove({
        properties: [removefill.PROPS_FILL]
    }))
    .pipe(gulp.dest("img"));
});

gulp.task("serve", ["style"], function() {
  server.init({
    server: ".",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
});

// gulp.watch("sass/**/*.{scss,sass}", ["style"]);
// gulp.watch("*.html").on("change", server.reload);
// gulp.watch("js/*.js",["scripts"]);

//Publish version
gulp.task("publish-style", function() {
    gulp.src("sass/style.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(minify())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("dist/css"))
        .pipe(server.stream());
});

gulp.task("publish-images", function() {
    return gulp.src("img/**/*.{png,jpg,svg}")
        .pipe(imagemin([
            imagemin.optipng({optimizationLevel: 3}),
            imagemin.jpegtran({progressive: true}),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest("dist/img"));
});

gulp.task("publish-sprite", function() {
    return gulp.src("img/sprite/*.svg")
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename("sprite.svg"))
        .pipe(removefill.remove({
            properties: [removefill.PROPS_FILL]
        }))
        .pipe(gulp.dest("dist/img"));
});

gulp.task("publish-html", function() {
    return gulp.src(["*.html"])
        .pipe(posthtml([
            includehtml()
        ]))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest("dist"))
        .pipe(server.stream());
});

gulp.task("publish-scripts", function() {
    return gulp.src("js/*.js")
        .pipe(concat("script.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("dist/js"));
});

gulp.task("publish-clean", function() {
    return del("dist");
});

gulp.task("publish-copy", function() {
    return gulp.src([
        "fonts/**/*.{woff,woff2}",
        "img/*.*"
    ], {
        base: "."
    })
        .pipe(gulp.dest("dist"));
});

gulp.task("publish-build", function() {
    run("publish-clean", "publish-copy", "publish-style", "publish-images", "publish-sprite", "publish-scripts", "publish-html")
});

gulp.task("publish-serve", function() {
    server.init({
        server: "dist/",
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch("sass/**/*.{scss,sass}", ["style"]);
    gulp.watch("*.html", ["html"]);
    gulp.watch("js/*.js",["scripts"]);
});
