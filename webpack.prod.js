const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  // encouraged to have source maps enabled in production as well,
  // useful for debugging as well as running benchmark tests
  devtool: "source-map",
});
