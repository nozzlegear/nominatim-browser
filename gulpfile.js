var gulp = require("gulp");
var rename = require("gulp-rename");
var webpack = require('webpack-stream');
var path = require("path");
var merge = require("lodash").merge;
var map = require("lodash").map;
var concat = require("gulp-concat");
var ts = require("gulp-typescript");
var mergetasks = require("merge2");
var tsconfig = require("./tsconfig");
var sequence = require('run-sequence');

var tsOptions = tsconfig.compilerOptions;
var tsFiles = tsconfig.files;

var webpackOptions = {
    externals: { },
    module: {
        loaders: [  ]
    },
    output: { },
    resolve: {
        root: __dirname
    }
};

gulp.task("lib", function ()
{
    var tsBuild = gulp.src(tsFiles)
        .pipe(ts(ts.createProject("./tsconfig.json"), {declaration: true}));
    
    var buildDefinition = tsBuild
        .dts
        .pipe(gulp.dest("./dist"));
        
    var buildLib = tsBuild
        .js
        .pipe(gulp.dest("./dist"));
        
    var buildWebpack = buildLib
        .pipe(webpack(merge({}, webpackOptions, {
            output: {
                libraryTarget: "var",
                library: "Nominatim"
            }
        })))
        .pipe(rename(function (outPath) 
        {
            outPath.dirname = "";
            outPath.basename = "nominatim-browser";
            outPath.extname = ".webpacked.js";
            
            return outPath;
        }))
        .pipe(gulp.dest("./dist"));
    
    return mergetasks(buildDefinition, buildLib, buildWebpack);
})

gulp.task("tests", function () 
{
    var buildTests = gulp.src("tests/*.ts")
        .pipe(ts(merge({}, tsOptions, {declaration: false})))
        .js
        .pipe(concat("all.js"))
        .pipe(gulp.dest("tests/built")) // Note: gulp-webpack-stream can't work with streams (!), needs the files to actually exist.
        .pipe(webpack(merge({}, webpackOptions, {
            externals: {
                "../dist/nominatim-browser": "Nominatim"
            }
        })))
        .pipe(rename(function (outPath) 
        {
            outPath.dirname = "";
            outPath.basename = "all";
            outPath.extname = ".webpacked.js";
            
            return outPath;
        }))
        .pipe(gulp.dest("tests/built"));

    return buildTests;
});

gulp.task("default", function ()
{
    return sequence("lib", "tests");
});