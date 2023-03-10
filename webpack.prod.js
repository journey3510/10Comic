const { merge } = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common(), {
  mode: 'production',
  externals: {
    // use @require in header to import vue
    vue: 'Vue',
    'element-ui': 'element-ui',
    'vant': 'vant',
    'jszip': 'JSZip',
    'axios': 'axios'
  },
  optimization: {
    minimize: false
  },
  // 关闭 webpack 的性能提示
  performance: {
    hints: false
  }
})
