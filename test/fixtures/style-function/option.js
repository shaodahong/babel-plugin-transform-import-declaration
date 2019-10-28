const presets = [['@babel/env']]

module.exports = {
  presets,
  plugins: [[require('../../../src'), { module: 'antd', style: module => `antd/${module}/custom` }]],
}
