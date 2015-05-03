System.config({
  "transpiler": "babel",
  "paths": {
    "*": "*.js",
    "sketch2/*": "lib/*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "meta": {
    "jspm_packages/babel-polyfill": {
      "format": "global"  // Prevents misdetection as AMD
    }
  }
});

System.config({
  "map": {
    "d3": "github:mbostock/d3@3.5.5",
    "dom-shims": "npm:dom-shims@0.1.4",
    "events": "github:jspm/nodelibs-events@0.1.0",
    "jquery": "github:components/jquery@2.1.3",
    "simulant": "npm:simulant@0.1.5",
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

