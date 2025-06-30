module.exports = {
  presets: [
    "@babel/preset-env",
    ["@babel/preset-react", { "runtime": "automatic" }]
  ],
  plugins: [
    "@babel/plugin-transform-class-properties",
    "@babel/plugin-transform-object-rest-spread"
  ]
};