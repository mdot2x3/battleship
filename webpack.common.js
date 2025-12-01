const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html",
    }),
  ],
  module: {
    rules: [
      // instructs webpack that if it encounters an imported file ending with .css,
      // it should use the listed loaders to process that CSS file
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      // in coordination with html-loader, for image files referenced in the HTML template, e.g. as the src of an <img>
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      // when manipulating the DOM to create or edit img elements and set their src attribute, need to import the files
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};
