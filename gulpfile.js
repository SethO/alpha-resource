const gulp = require('gulp');
require('git-guppy')(gulp);
const runSequence = require('run-sequence').use(gulp); //make sure we aren't using global gulp
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
    'set-int-aws-env',
    'build:lint',
    'test:unit',
    'deploy:serverless:int',
    'test:integration',
    'set-sand-aws-env',
    'deploy:serverless:sand',
    'set-prod-aws-env',
    'deploy:serverless:prod'
  );
});

gulp.task('deploy:serverless:int', () => {
  return gulp.src(paths.serverless, { read: false })
      .pipe(serverlessGulp.exec('deploy', {
        stage: 'int',
        environment: 'integration',
        cfRouterAccessKeyId: process.env.INT_AWS_ACCESS_KEY_ID,
        cfRouterSecretAccessKey: process.env.INT_AWS_SECRET_ACCESS_KEY
      }));
});

gulp.task('deploy:serverless:sand', () => {
  return gulp.src(paths.serverless, { read: false })
      .pipe(serverlessGulp.exec('deploy', {
        stage: 'sand',
        environment: 'sandbox',
        cfRouterAccessKeyId: process.env.SAND_AWS_ACCESS_KEY_ID,
        cfRouterSecretAccessKey: process.env.SAND_AWS_SECRET_ACCESS_KEY
      }));
});

gulp.task('deploy:serverless:prod', () => {
  return gulp.src(paths.serverless, { read: false })
      .pipe(serverlessGulp.exec('deploy', {
        stage: 'prod',
        environment: 'production',
        accountId: process.env.PROD_ACCOUNT_ID,
        cfRouterAccessKeyId: process.env.SAND_AWS_ACCESS_KEY_ID, //The cloud front router is in the current int/sand environment it will eventually move to prod
        cfRouterSecretAccessKey: process.env.SAND_AWS_SECRET_ACCESS_KEY//The cloud front router is in the current int/sand environment it will eventually move to prod
      }));
});

gulp.task('build:lint', () => {
  return gulp.src(['src/**/*.js', 'test/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('set-int-aws-env', () => {
  process.env.AWS_ACCESS_KEY_ID = process.env.INT_AWS_ACCESS_KEY_ID;
  process.env.AWS_SECRET_ACCESS_KEY = process.env.INT_AWS_SECRET_ACCESS_KEY;
});

gulp.task('set-sand-aws-env', () => {
  process.env.AWS_ACCESS_KEY_ID = process.env.SAND_AWS_ACCESS_KEY_ID;
  process.env.AWS_SECRET_ACCESS_KEY = process.env.SAND_AWS_SECRET_ACCESS_KEY;
});

gulp.task('set-prod-aws-env', () => {
  process.env.AWS_ACCESS_KEY_ID = process.env.PROD_AWS_ACCESS_KEY_ID;
  process.env.AWS_SECRET_ACCESS_KEY = process.env.PROD_AWS_SECRET_ACCESS_KEY;
});
