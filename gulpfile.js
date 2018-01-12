const gulp = require('gulp');
require('git-guppy')(gulp);
const runSequence = require('run-sequence').use(gulp); //Don't use global gulp
const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');
const serverlessGulp = require('serverless-gulp');

const paths = {
  serverless: ['./**/serverless.yml', '!node_modules/**/serverless.yml']
};

gulp.task('default', ['test:unit']);

gulp.task('pre-commit', ['test:unit']);

gulp.task('test:unit', ['build:lint'], () => {
  process.env.AWS_LAMBDA_FUNCTION_NAME = 'default';
  return gulp.src('test/unit/**/*.js', {read: false})
    .pipe(mocha());
});

gulp.task('test:integration', () => {
  return gulp.src('test/integration/**/*.js', {read: false})
    .pipe(mocha());
});

gulp.task('deploy', () => {
  return runSequence(
    'build:lint',
    'test:unit',
    'deploy:serverless',
    'test:integration'
  );
});

gulp.task('deploy:serverless', () => {
  return gulp.src(paths.serverless, { read: false })
      .pipe(serverlessGulp.exec('deploy', {
        stage: 'prod',
        environment: 'production'
      }));
});

gulp.task('build:lint', () => {
  return gulp.src(['src/**/*.js', 'test/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});