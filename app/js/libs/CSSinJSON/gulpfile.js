// Простой livereload
var gulp = require('gulp')
var browserSync = require('browser-sync')

// Для сборки модулей
var path = require('path');
var browserify = require('browserify');
var babelify = require('babelify');
var browserSync = require('browser-sync');
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
    // var merge = require('utils-merge')
var rename = require('gulp-rename')
var sourcemaps = require('gulp-sourcemaps')
var tap = require('gulp-tap')
var del = require('del')
var uglify = require('gulp-uglify')

/* --- Красивое отображение ошибок --- */
var gutil = require('gulp-util')
var chalk = require('chalk')

function map_error(err) {
    if (err.fileName) {
        // Ошибка в файле
        gutil.log(chalk.red(err.name) +
            ': ' +
            chalk.yellow(err.fileName.replace(__dirname + './app/js/', '')) +
            ': ' +
            'Line ' +
            chalk.magenta(err.lineNumber) +
            ' & ' +
            'Column ' +
            chalk.magenta(err.columnNumber || err.column) +
            ': ' +
            chalk.blue(err.description))
    } else {
        // Ошибка browserify
        gutil.log(chalk.red(err.name) +
            ': ' +
            chalk.yellow(err.message))
    }

    this.emit('end')
}
/* === Красивое отображение ошибок === */

/* Таск, который вызывается из вотчера */
gulp.task('js', function() {
    browserify_js_files.forEach(file => {
        let file_name = path.basename(file)
        let bundler = browserify(file, { debug: true })
            .transform(babelify, {
                presets: ["@babel/preset-env"]
            });
        bundle_js(bundler, file_name)
    })
})

// Функция, которая выполняет работу с файлами js после browserify
function bundle_js(bundler, name) {
    return bundler.bundle()
        .on('error', map_error)
        .pipe(source(name))
        .pipe(buffer())
        .pipe(rename({ suffix: '.min', prefix: '' }))
        .pipe(sourcemaps.init({ loadMaps: true })) // Захват sourcemaps из трансформации
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./app/js'))

    .pipe(tap(file => {
            gutil.log(chalk.yellow(`Browserify: `) + chalk.white(file.path))
        }))
        .pipe(browserSync.reload({ stream: true }))
}


/* --- livereload --- */
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './app'
        },
        cors: true,
        notify: false,
        open: false,
        reloadOnRestart: true
    });
});


gulp.task('livereload', function() {
    browserSync.reload({ stream: false })
});
/* === livereload === */



/* Файлы, которые надо обрабатывать с помощью browserify */
const browserify_js_files = [
    './app/js/css-in-json.js'
]


gulp.task('watch', ['js', 'browser-sync'], function() {

    // Будем запускать таск js при изменении любого не минифицированного js
    gulp.watch(['app/**/*.js', '!app/**/*.min.js'], ['js'])

    // При изменении html просто перезагружаем браузер
    gulp.watch(['app/**/*.html', 'app/**/*.json', '*.md'], ['livereload'])
});


gulp.task('default', ['watch']);

gulp.task('clean', function() {
    return del.sync('./build');
});

const build_files = {
    './app/js/css-in-json.min.js': './build',
    // './app/index.html': './build'
}



gulp.task('build', ['clean', 'js'], function() {
    for (let src in build_files) {
        gulp.src(src).pipe(gulp.dest(build_files[src]))
    }
});