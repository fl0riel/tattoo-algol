"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var svgsprite = require("gulp-svg-sprites");
var rsp = require("remove-svg-properties").stream;
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
  return gulp.src("img/*.svg")
    .pipe(rsp.remove({
      properties: [rsp.PROPS_FILL, 'class', 'data-name', 'opacity', 'id']
    }))
    .pipe(gulp.dest("img"));
});

gulp.task("svg2", function () {
  return gulp.src("img/*.svg")
    .pipe(svgsprite({
      svgId: "svg-%f"
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

gulp.watch("sass/**/*.{scss,sass}", ["style"]);
gulp.watch("*.html").on("change", server.reload);
