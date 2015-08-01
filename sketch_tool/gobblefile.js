var gobble = require( 'gobble' );
var glob = require('glob');
var path = require('path');
var jspm = require('jspm');


var styles = gobble('styles')
  .transform('sass', {
    src: 'main.scss',
    dest: 'main.css'
  })
  .transform('autoprefixer')


var vendorBundle = gobble([
  gobble('lib/vendor').moveTo('vendor'),
  gobble('jspm_packages'),
])
  .transform('concat', {
    dest: 'vendorBundle.js',
    files: ['system-polyfills.js', 'system.js', 'vendor/*.js'],
  });


var libAndPlugins = gobble([
  gobble('lib')
    .exclude('plugins/**/*')
    .exclude('vendor/**/*')
    .moveTo('lib'),

  gobble('lib/plugins')
    .moveTo('plugins'),
]);


var appScripts;

if (gobble.env() === 'production') {
  var jspmBundle = gobble([
    gobble('config.js'),
    gobble('package.json'),
    gobble('jspm_packages').moveTo('jspm_packages'),
    libAndPlugins,
  ])
    .transform(function jspmBundle(inputdir, outputdir, options, callback) {
      var entryPoints = glob.sync('plugins/*.js', {cwd: inputdir});
      entryPoints.push('lib/main.js');

      jspm.setPackagePath(inputdir);
      jspm.bundle(
        entryPoints.join(' + '),
        path.join(outputdir, 'jspmBundle.js'),
        {minify: true, sourceMaps: true}
      ).then(callback);
    });

  appScripts = gobble([
    jspmBundle,
    gobble('config.js'),
  ])
    .transform('concat', {
      dest: 'appBundle.js',
      files: ['config.js', 'jspmBundle.js'],  // config.js must come first
    });
}
else {
  appScripts = gobble([
    gobble('config.js'),
    gobble('jspm_packages').moveTo('jspm_packages'),
    libAndPlugins
      .transform('babel', {
        optional: ['runtime'],
        modules: 'system'
      }),
  ]);
}


var staticAssets = gobble([
  libAndPlugins.exclude('**/*.js'),

  gobble('LICENSE')
    .transform('rename', {from: 'LICENSE', to: 'LICENSE.txt'}),

  gobble('fonts').moveTo('fonts'),

  gobble('html')
    .transform('replace', {
      css_path: 'main.css',
      font_css_path: 'fonts/roboto.css',
      vendor_bundle_path: 'vendorBundle.js',
      config_or_app_bundle_path: (gobble.env() === 'production') ? 'appBundle.js' : 'config.js',
    }),
]);

module.exports = gobble([
  styles,
  vendorBundle,
  appScripts,
  staticAssets,
]);
