const config = require('../config')

const {src, dest} = require('gulp')
const gulpif = require('gulp-if')
const through = require('through2')
const sharp = require('sharp')

// Recompresses jpg/png and emits a .webp copy next to each of them,
// other files (svg, gif, ico, webp) pass through untouched
function optimize() {
  return through.obj(function(file, _, cb) {
    if (file.isNull() || !/\.(jpe?g|png)$/i.test(file.path)) {
      return cb(null, file)
    }

    const img = sharp(file.contents)
    const original = /\.png$/i.test(file.path)
      ? img.clone().png({compressionLevel: 9})
      : img.clone().jpeg({quality: 75, progressive: true, mozjpeg: true})

    Promise.all([original.toBuffer(), img.webp({quality: 70}).toBuffer()])
      .then(([originalBuf, webpBuf]) => {
        const webp = file.clone({contents: false})
        webp.contents = webpBuf
        webp.extname = '.webp'
        this.push(webp)

        file.contents = originalBuf
        cb(null, file)
      })
      .catch(err => cb(err))
  })
}

function images(bs) {
  return src(config.src.img)
    .pipe(gulpif(config.production, optimize()))
    .pipe(dest(config.build.img))
    .pipe(gulpif(!config.production, bs.stream()))
}

module.exports = images
