module.exports = {
  "comments": false,
  "ignore": [
    "interface.js"
  ],
  "env": {
    "production": {
      "presets": [
        "@babel/preset-flow",
        ["@babel/preset-env", {"modules": false}]
      ],
      "plugins": [
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-transform-runtime",
        "@babel/plugin-proposal-object-rest-spread"
      ]
    },
    "test": {
      "presets": [
        "@babel/preset-flow",
        "@babel/preset-env"
      ],
      "plugins": [
        "@babel/plugin-transform-modules-commonjs",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-object-rest-spread"
      ]
    }
  }
}
