const tsAsset = require('./ts-asset.js')

module.exports =
  bundler =>
    bundler.addAssetType('ts', tsAsset.path)
