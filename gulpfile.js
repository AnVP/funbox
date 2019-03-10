const autoprefixer = require(`autoprefixer`);
const csso = require(`gulp-csso`);
const del = require(`del`);
const gulp = require(`gulp`);
const htmlmin = require(`gulp-htmlmin`);
const posthtml = require(`gulp-posthtml`);
const include = require(`posthtml-include`);
const sass = require(`gulp-sass`);
const postcss = require(`gulp-postcss`);
const sync = require(`browser-sync`).create();
const plumber = require(`gulp-plumber`);
const jsmin = require(`gulp-jsmin`);
const postcssPresetEnv = require(`postcss-preset-env`);
const imagemin = require(`gulp-imagemin`);
const webp = require(`gulp-webp`);
const concat = require(`gulp-concat`);
const babel = require(`gulp-babel`);

// HTML

gulp.task(`html`, () => {
  return gulp
    .src(`src/*.html`)
    .pipe(posthtml([include()]))
    .pipe(
        htmlmin({
          removeComments: true
        })
    )
    .pipe(gulp.dest(`build`))
    .pipe(
        sync.stream({
          once: true
        })
    );
});

// CSS

gulp.task(`css`, () => {
  return gulp
    .src(`src/styles/style.scss`)
    .pipe(plumber())
    .pipe(concat(`style.css`))
    .pipe(sass())
    .pipe(
        postcss([
          postcssPresetEnv({
            stage: 0
          })
        ])
    )
    .pipe(postcss([autoprefixer]))
    .pipe(csso())
    .pipe(gulp.dest(`build/css`))
    .pipe(sync.stream());
});

// JS

gulp.task(`scripts`, () => {
  return (
    gulp
      .src(`src/scripts/*.js`)
      .pipe(babel())
      .pipe(concat(`scripts.js`))
      .pipe(jsmin())
      .pipe(gulp.dest(`build/scripts`))
      .pipe(
          sync.stream({
            once: true
          })
      )
  );
});

// Images

gulp.task(`webp`, function () {
  return gulp
    .src(`src/img/**/*.{png,jpg}`)
    .pipe(
        webp({
          quality: 90
        })
    )
    .pipe(gulp.dest(`build/img`));
});

gulp.task(`images`, function () {
  return gulp
    .src([`src/img/**/*.{png,jpg}`])
    .pipe(
        imagemin([
          imagemin.optipng({
            optimizationLevel: 3
          }),
          imagemin.jpegtran({
            progressive: true
          })
        ])
    )
    .pipe(gulp.dest(`build/img`));
});

// Copy

gulp.task(`copy`, () => {
  return gulp
    .src(
        [
          `src/fonts/*`,
          `src/img/**/*.{jpg,png}`,
          `!src/styles/*`,
          `!src/scripts/*`,
          `!src/**/*.html`,
          `src/*.txt`,
          `src/*.{jpg,png}`
        ],
        {
          base: `src`
        }
    )
    .pipe(gulp.dest(`build`))
    .pipe(
        sync.stream({
          once: true
        })
    );
});

gulp.task(`clean`, function (cb) {
  return del(`build`, cb);
});

// Server

gulp.task(`server`, () => {
  sync.init({
    ui: false,
    notify: false,
    server: {
      baseDir: `build`
    }
  });
});

// Watch

gulp.task(`watch:html`, () => {
  return gulp.watch(`src/**/*.html`, gulp.series(`html`));
});

gulp.task(`watch:css`, () => {
  return gulp.watch(`src/styles/**/*.scss`, gulp.series(`css`));
});

gulp.task(`watch:scripts`, () => {
  return gulp.watch(`src/scripts/*.js`, gulp.series(`scripts`));
});

gulp.task(`watch:copy`, () => {
  return gulp.watch(
      [
        `src/*`,
        `src/fonts/*`,
        `src/img/**/*.{jpg,png}`,
        `!src/styles/*`,
        `!src/scripts/*`,
        `!src/**/*.html`
      ],
      gulp.series(`copy`)
  );
});

gulp.task(
    `watch`,
    gulp.parallel(
        `watch:html`,
        `watch:css`,
        `watch:scripts`,
        `watch:copy`
    )
);

// Build

gulp.task(
    `all`,
    gulp.parallel(`images`, `html`, `css`, `scripts`, `copy`)
);

gulp.task(`build`, gulp.series(`clean`, `all`));

// Default

gulp.task(`default`, gulp.series(`build`, gulp.parallel(`watch`, `server`)));
