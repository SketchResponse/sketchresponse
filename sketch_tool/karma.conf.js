module.exports = function(config) {
  config.set({
    autoWatch: true,
    frameworks: ['jspm', 'jasmine'],
    browsers: ['Chrome'],
    jspm: {
      loadFiles: ['test/**/*.js'],
      serveFiles: ['lib/**/*.js']
    }
  });
};
