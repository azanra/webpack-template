const { default: merge } = require("webpack-merge");
const webpackCommon = require("./webpack.common.js");

module.exports = merge(webpackCommon, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    watchFiles: ["./src/index.html"],
    static: "./dist",
  },
});
