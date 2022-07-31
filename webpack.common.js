const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

// const pathResolve = (dir) => {
//   return path.resolve(__dirname, '..', dir)
// }

module.exports = () => {
  const entryFile = process.env.TAMPERMONKEY_ENTRY_FILE
  return {
    entry: {
      app: './src/main.js'
    },
    output: {
      filename: entryFile,
      path: path.resolve(__dirname, 'dist')
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.less$/i,
          use: [
            // compiles Less to CSS
            'style-loader',
            'css-loader',
            'less-loader'
          ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader'
          ]
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            loaders: {
              'scss': [
                'style-loader',
                'css-loader',
                'sass-loader',
                'less-loader'
              ]
            }
          }
        },
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        __APP_NAME__: JSON.stringify(process.env.TAMPERMONKEY_APP_NAME),
        __APP_ENVIRONMENT__: JSON.stringify(process.env.TAMPERMONKEY_APP_ENVIRONMENT),
        __APP_VERSION__: JSON.stringify(require('./package.json').version)
      })
    ]
  }
}
