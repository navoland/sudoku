const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const prod = process.argv.includes('-p')

const conf = {
  entry: ['@iro/wechat-adapter', './src/app.ts'],

  output: {
    path: path.resolve('dist/root'),
    filename: 'game.js'
  },

  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      '@': path.resolve('.'),
      '~': path.resolve('./src'),
    }
  },

  devtool: prod ? false : 'source-map',

  stats: 'errors-only',

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.ts$/,
        use: ['eslint-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.ts$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.(vert|frag|html)$/,
        use: ['raw-loader']
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      PROD: JSON.stringify(prod),
      CLOUD_ID: JSON.stringify('colloc-dev'),
      VERSION: JSON.stringify(require('./package.json').version),
      CDN: JSON.stringify('cloud://colloc-dev.636f-colloc-dev-1258618978')
    }),

    new webpack.ProvidePlugin({
      PIXI: 'pixi.js',
    })
  ],

  mode: prod ? 'production' : 'development',

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: 4,
        extractComments: false,
        terserOptions: {
          output: {
            comments: false
          }
        },
      })
    ]
  }
}

if (!prod) {
  conf.plugins.push(
    new ProgressBarPlugin()
  )
}

module.exports = conf
