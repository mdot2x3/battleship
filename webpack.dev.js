const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  // in coordination with webpack-dev-server, source map sets references for any error message
  // files/lines to reflect the development code and not the ./dist bundled .js file
  devtool: "eval-source-map",
  // by default, webpack-dev-server will only auto-restart when it detects changes to files
  // imported into the JavaScript bundle, watchFiles fixes this
  devServer: {
    watchFiles: ["./src/template.html"],
  },
});
