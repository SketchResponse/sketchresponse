System.config({
  "transpiler": "babel",
  "paths": {
    "*": "*.js",
    "sketch2/*": "lib/*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  },
  "meta": {
    "jspm_packages/babel-polyfill": {
      "format": "global"  // Prevents misdetection as AMD
    }
  }
});

System.config({
  "map": {
    "events": "github:jspm/nodelibs-events@0.1.0",
    "github:jspm/nodelibs-events@0.1.0": {
      "events-browserify": "npm:events-browserify@0.0.1"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:events-browserify@0.0.1": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

