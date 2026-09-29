const fs = require('fs')
const path = require('path')
const gulpConfig = require('./gulp/config')
// const BundleAnalyzerPlugin =
// require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// Saves the script files of the app entry, the html task renders them
// as <script> tags into the layout
class EntrypointsPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tap('EntrypointsPlugin', compilation => {
      const files = compilation.entrypoints
        .get('app')
        .getFiles()
        .filter(file => file.endsWith('.js'))
      const file = path.resolve(__dirname, gulpConfig.entrypoints)
      fs.mkdirSync(path.dirname(file), {recursive: true})
      fs.writeFileSync(file, JSON.stringify(files))
    })
  }
}

function createConfig(env) {
  const isProduction = env === 'production'

  const devName = '[name].js'
  const buildName = '[name].[contenthash:8].js'

  const filename = env === 'production' ? buildName : devName

  if (env === undefined) {
    env = process.env.NODE_ENV
  }

  const webpackConfig = {
    entry: {
      app: path.resolve(__dirname, 'src/js/app.js'),
    }, // If you need support IE11
    output: {
      filename,
      chunkFilename: isProduction
        ? '[name].[contenthash:8].chunk.js'
        : '[name].chunk.js',
      path: path.resolve(__dirname, 'build/js/'),
      publicPath: './js/',
    },
    resolve: {
      extensions: ['.js'],
      alias: {
        '@': path.resolve(__dirname, 'src/js'),
        '@core': path.resolve(__dirname, 'src/js/core'),
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            cacheDirectory: true,
          },
        },
        {
          test: /\.glsl$/,
          exclude: /node_modules/,
          loader: 'webpack-glsl-loader',
        },
      ],
    },
    mode: isProduction ? 'production' : 'development',
    devtool: !isProduction ? 'eval-cheap-module-source-map' : false,
    performance: {
      hints: isProduction ? 'warning' : false,
    },
    optimization: {
      runtimeChunk: {
        name: entrypoint => `runtime-${entrypoint.name}`,
      },
      minimize: isProduction,
      emitOnErrors: false,
      splitChunks: {
        // include all types of chunks
        chunks: 'all',
        minSize: 10000,
        // cacheGroups: {
        //   vendor: {
        //     test: /[\\/]node_modules[\\/](three)[\\/]/,
        //     name: 'three.vendor',
        //     chunks: 'all',
        //     minSize: 1
        //   }
        // }
      },
    },
    plugins: [new EntrypointsPlugin()],
  }

  // if (isProduction) {
  //   // webpackConfig.plugins.push(

  //   //   new BundleAnalyzerPlugin({
  //   //     analyzerMode: 'server',
  //   //     analyzerPort: 5500,
  //   //     openAnalyzer: false
  //   //   })
  //   // )
  // }

  return webpackConfig
}

module.exports = createConfig
