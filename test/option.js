const presets = [['@babel/env']]

module.exports = {
  presets,
  plugins: [[require('../src'), { module: 'antd', libraryName: 'lib' }]],
}
