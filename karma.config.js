const webpackConfig = require('./webpack.config');

module.exports = (config) => {
  const configuration = {
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      'karma-jasmine',
      'karma-webpack',
      'karma-chrome-launcher',
      'karma-sourcemap-loader',
      'karma-babel-preprocessor',
      'karma-spec-reporter',
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
    reporters: ['spec'],
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
    singleRun: false,
    concurrency: Infinity,
    webpack: webpackConfig,
    webpackMiddleware: {
      // noInfo: true,
    },
  };

  if (process.env.TRAVIS) {
    configuration.browsers = ['Chrome_travis_ci'];
  }

  config.set(configuration);
};
