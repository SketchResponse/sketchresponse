var gobble = require( 'gobble' );

module.exports = gobble([
  gobble('styles')
    .transform('sass', {
      src: 'main.scss',
      dest: 'main.css'
    })
    .transform('autoprefixer'),

  gobble([
    gobble('lib').exclude('plugins/**/*').moveTo('lib'),
    gobble('lib/plugins').moveTo('plugins'),
  ])
    .transform('babel', {
      optional: ['runtime'],
      modules: 'system'
    }),

  gobble('LICENSE')
    .transform('rename', {from: 'LICENSE', to: 'LICENSE.txt'}),

  gobble('config.js'),
  gobble('jspm_packages').moveTo('jspm_packages'),
  gobble('fonts').moveTo('fonts'),
  gobble('lib/vendor').moveTo('vendor'),

  gobble('html')
    .transform('replace', {
      system_polyfills_path: 'jspm_packages/system-polyfills.js',
      systemjs_path: 'jspm_packages/system.js',
      configjs_path: 'config.js',
      css_path: 'main.css'
    })
]);
