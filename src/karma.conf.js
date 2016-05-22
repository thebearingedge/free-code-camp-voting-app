
module.exports = config => config.set({

  frameworks: ['browserify', 'mocha'],

  plugins: [
    'karma-browserify',
    'karma-jsdom-launcher',
    'karma-mocha',
    'karma-mocha-reporter',
    'karma-coverage'
  ],

  files: [
    'node_modules/babel-polyfill/dist/polyfill.js',
    {
      pattern: 'client/**/*.test.js',
      watched: false, included: true, served: true
    },
    {
      pattern: 'client/*.js',
      watched: false, included: true, served: true
    }
  ],

  preprocessors: {
    'client/**/*.test.js': ['browserify'],
    'client/*.js': ['browserify']
  },

  browserify: {
    transform: [
      ['babelify', {
        presets: ['es2015', 'stage-2'],
        sourceMap: 'inline'
      }],
      ['browserify-babel-istanbul', {
      }]
    ]
  },

  reporters: ['mocha'],

  mochaReporter: { output: 'autowatch' },

  port: 9876,

  autoWatchBatchDelay: 0,

  logLevel: config.LOG_ERROR,

  browsers: ['jsdom']

})
