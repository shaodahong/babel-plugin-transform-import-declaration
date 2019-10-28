const glob = require('glob')
const path = require('path')
const fs = require('fs')
const { transformFileSync } = require('@babel/core')
const { toMatchFile } = require('jest-file-snapshot')

expect.extend({ toMatchFile })

function getTestName(testPath) {
  return path.basename(testPath).split('-').join(' ')
}

describe.each(glob.sync(path.join(__dirname, 'fixtures/*/')))('fixtures', testPath => {
  const testName = getTestName(testPath)
  const inputPath = path.join(testPath, 'input.js')
  const outPath = path.join(testPath, 'output.js')
  const optionPath = path.join(testPath, 'option.js')

  it(`should work with ${testName}`, () => {
    const input = transformFileSync(inputPath, {
      configFile: fs.existsSync(optionPath) ? optionPath : path.join(__dirname, 'option.js'),
    }).code

    if (!fs.existsSync(outPath)) {
      fs.writeFileSync(outPath, input)
    }

    const output = fs.readFileSync(outPath, 'utf8')

    expect(input.trim()).toMatchFile(outPath)
  })
})
