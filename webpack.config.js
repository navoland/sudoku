const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')


module.exports = ({prod = false} = {}) => {
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

    watch: !prod,

    module: {
      rules: [
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
        dragonBones: 'dragonbones.js'
      })
    ],

    mode: 'development',
  }

  if (prod) {
    conf.mode = 'production'
    conf.optimization = {
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
  } else {
    conf.plugins.push(
      new ProgressBarPlugin()
    )
  }

  return conf
}
