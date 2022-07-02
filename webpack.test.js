const { merge } = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common(), {
  mode: 'production',
  // 根据 Greasy Fork 规则取消最小化
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
  devtool: 'cheap-source-map',
  // 关闭 webpack 的性能提示
  performance: {
    hints: false
  }
})
