const JSAsset = require('parcel-bundler/src/assets/JSAsset')
const babel7 = require('parcel-bundler/src/transforms/babel/babel7')
const fsVisitor = require('parcel-bundler/src/visitors/fs')
const insertGlobals = require('parcel-bundler/src/visitors/globals')
const hoist = require('parcel-bundler/src/scope-hoisting/hoist')
const terser = require('parcel-bundler/src/transforms/terser')
const walk = require('babylon-walk')

const GLOBAL_RE = /\b(?:process|__dirname|__filename|global|Buffer|define)\b/
const FS_RE = /\breadFileSync\b/

module.exports = class TSAsset extends JSAsset {
  constructor (...args) {
    super(...args)
  }

  // https://github.com/parcel-bundler/parcel/blob/master/packages/core/parcel-bundler/src/assets/JSAsset.js#L165
  async transform() {
    if (this.options.target === 'browser') {
      if (this.dependencies.has('fs') && FS_RE.test(this.contents)) {
        // Check if we should ignore fs calls
        // See https://github.com/defunctzombie/node-browser-resolve#skip
        let pkg = await this.getPackage();
        let ignore = pkg && pkg.browser && pkg.browser.fs === false

        if (!ignore) {
          await this.parseIfNeeded()
          this.traverse(fsVisitor)
        }
      }

      if (GLOBAL_RE.test(this.contents)) {
        await this.parseIfNeeded()
        walk.ancestor(this.ast, insertGlobals, this)
      }
    }

    if (this.options.scopeHoist) {
      await this.parseIfNeeded()
      await this.getPackage()

      this.traverse(hoist)
      this.isAstDirty = true
    } else {
      if (this.isES6Module) {
        await babel7(this, {
          internal: true,
          config: {
            plugins: [
              require('@babel/plugin-transform-modules-commonjs'),
              require('@babel/plugin-transform-typescript')
            ]
          }
        })
      }
    }
    if (this.options.minify) {
      await terser(this)
    }
  }
}

module.exports.path = __filename
