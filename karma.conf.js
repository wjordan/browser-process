module.exports = function(config) {
  config.set({
    files:['test/**/*.js'],
    preprocessors: { 'test/**/*.js': [ 'browserify' ] },
    frameworks: ['mocha', 'browserify'],
    browsers: ['PhantomJS'],
    browserify: {
      builtins: ['assert', 'buffer', 'path', 'events'],
      insertGlobalVars: {
        process: function () {
          var processPath = require.resolve('./dist/node_process');
          return 'require(' + JSON.stringify(processPath) + ')';
        }
      }
    }
  });
};
