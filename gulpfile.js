'use strict';

const { watch, series, task} = require('gulp');
const helper = require('gulp-sass-helper');

const paths = { sass: { src: ['./styles/**/*.scss', './react/**/*.scss', '!./react/node_modules/**/*.scss'], dest: './react' } };

const runSassCompiler = (done) => {
    helper.sassCompiler(paths);
    done();
};

const build = series(runSassCompiler);

const watchFiles = () => {
    watch(paths.sass.src, build);
};

task('default', series(build, watchFiles));