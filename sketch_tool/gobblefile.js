var gobble = require( 'gobble' );

module.exports = gobble([
  gobble('styles')
    .transform('sass', {
      src: 'main.scss',
      dest: 'main.css'
    })
    .transform('autoprefixer'),

  gobble('lib')
    .transform('babel', {
      optional: ['runtime'],
      modules: 'system'
    })
    .moveTo('lib'),

  gobble('config.js'),
  gobble('jspm_packages').moveTo('jspm_packages'),
  gobble('lib/plugins').moveTo('plugins'),
  gobble('fonts').moveTo('fonts'),

  gobble('html')
    .transform('replace', {
      systemjs_path: 'jspm_packages/system.js',
      configjs_path: 'config.js',
      css_path: 'main.css'
    })
]);
