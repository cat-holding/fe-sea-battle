const webpackConfig = require('./webpack.config');

module.exports = (config) => {
  const configuration = {
    basePath: '',
    frameworks: [
      'jasmine',
      'jasmine-matchers',
    ],
    plugins: [
      'karma-jasmine',
      'karma-jasmine-matchers',
      'karma-webpack',
      'karma-chrome-launcher',
      'karma-sourcemap-loader',
      'karma-babel-preprocessor',
      'karma-spec-reporter',
      'karma-coverage',
      'karma-coveralls',
    ],
    files: [
      './tests/**/*.spec.js',
    ],
    exclude: [],
    preprocessors: {
      './tests/**/*.js': ['webpack', 'sourcemap'],
    },
    babelPreprocessor: {
      options: {
        presets: ['es2015'],
        sourceMap: 'inline',
      },
    },
    reporters: ['spec', 'coverage', 'coveralls'],
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/',
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox'],
      },
    },
    singleRun: true,
    concurrency: Infinity,
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true,
    },
  };

  if (process.env.TRAVIS) {
    configuration.browsers = ['Chrome_travis_ci'];
  }

  config.set(configuration);
};
