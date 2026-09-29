const log = require('fancy-log')
const colors = require('ansi-colors')
const foldersName = require('./foldersName')

const projectFolder = foldersName.projectFolder
const sourceFolder = foldersName.sourceFolder
const staticFolder = foldersName.staticFolder

const production =
  process.argv.includes('--production') || process.argv.includes('--prod')

const config = {
  env: 'development',
  production: production,
  templates: sourceFolder + '/templates',
  hash: 'e' + Date.now(),
  build: {
    html: projectFolder + '/',
    static: projectFolder + '/',
    php: projectFolder + '/',
    css: projectFolder + '/css/',
    js: projectFolder + '/js/',
    img: projectFolder + '/img/',
    video: projectFolder + '/video/',
    audio: projectFolder + '/audio/',
    fonts: projectFolder + '/fonts/',
  },
  // Script files of the webpack entry, written by webpack and read by the html task
  entrypoints: '.tmp/entrypoints.json',
  src: {
    templates: 'src/templates',
    html: [
      sourceFolder + '/*.html',
      '!' + sourceFolder + '/_*.html',
      '!' + sourceFolder + '/data/data.html',
    ],
    static: staticFolder + '/**/*',
    php: projectFolder + '/**/*.php',
    css: sourceFolder + '/scss/app.scss',
    js: sourceFolder + '/js/app.js',
    img: sourceFolder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
    video: sourceFolder + '/video/**/*',
    audio: sourceFolder + '/audio/**/*',
    fonts: sourceFolder + '/fonts/*.ttf',
  },
  watch: {
    html: sourceFolder + '/**/*.html',
    css: sourceFolder + '/scss/**/*.{scss,sass}',
    js: sourceFolder + '/js/**/*.{js,glsl,json}',
    img: sourceFolder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
    video: sourceFolder + '/video/**/*',
    audio: sourceFolder + '/audio/**/*',
  },
  clean: './' + projectFolder + '/',
  cleanJS: projectFolder + '/js/app.*',
  cleanCSS: projectFolder + '/css',

  setEnv: function (env) {
    if (typeof env !== 'string') return
    this.env = env
    this.production = env === 'production'
    process.env.NODE_ENV = env
  },

  logEnv: function () {
    log('Environment:', colors.white.bgMagenta(' ' + process.env.NODE_ENV + ' '))
  },

  // errorHandler: require('./util/handle-errors')
}

config.setEnv(production ? 'production' : 'development')

module.exports = config
