const presets = ['@babel/env', '@babel/preset-react']

module.exports = {
  presets,
  plugins: [[require('../../../src'), { module: 'antd', libraryName: 'lib' }]],
}
