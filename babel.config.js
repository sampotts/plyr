'use strict'

// @babel/preset-env uses .browserslistrc to define which plugins should be used

module.exports = {
  compact: false,
  presets: ['@babel/preset-env'],
  plugins: ['@babel/plugin-proposal-class-properties']
}
