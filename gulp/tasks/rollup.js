const gulp   = require('gulp'),
    rollup = require('rollup'),
    babel = require('rollup-plugin-babel'),
    resolve = require('rollup-plugin-node-resolve'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    header = require('gulp-header'),
    config = require('../config'),
    copyrights = require('./copyrights');

function es() {
    const env = process.env.NODE_ENV || 'development';

    rollup.rollup({
        input: 'src/js/slippery.js',
        plugins: [
            resolve(),
            babel({
                exclude: 'node_modules/**' // only transpile our source code
            }),
        ]
    }).then(bundle => bundle.write({
        format: 'es',
        name: 'Slippery',
        strict: true,
        copyrights,
        sourcemap: env === 'development',
        sourcemapFile: `./${env === 'development' ? 'build' : 'dist'}/js/slippery.esm.bundle.js.map`,
        file: `./${env === 'development' ? 'build' : 'dist'}/js/slippery.esm.bundle.js`,
    })).catch((err) => {
        console.error(err.toString());
    });
}

function umd() {
    const env = process.env.NODE_ENV || 'development';

    console.log(env);
    rollup.rollup({
        input: 'src/js/slippery.js',
        plugins: [
            resolve(),
            babel({
                exclude: 'node_modules/**',
            }),
        ]
    }).then(bundle => {
        return bundle.write({
            name: 'Slippery',
            file: `./${env === 'development' ? 'build' : 'dist'}/js/slippery.js`,
            format: 'umd',
            strict: true,

            sourcemap: env === 'development',
            sourcemapFile: `./${env === 'development' ? 'build' : 'dist'}/js/slippery.js.map`,
        });
    }).then(() => {
        if (env === 'development') {
          return;
        }
        gulp.src('./dist/js/slippery.js')
            .pipe(sourcemaps.init())
            .pipe(uglify())
            .pipe(header(copyrights))
            .pipe(rename((filePath) => {
                filePath.basename += '.min';
            }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist/js/'));
    }).catch((err) => {
        console.error(err.toString());
    });
}

function build() {
    const env = process.env.NODE_ENV || 'development';

    umd();

    if ( env !== 'development' ) {
        es();
    }
}

module.exports = build;
