# webpack-template

Template repository, since it will be pain in the ass to do it again from scratch everytime i need to create a new vanilla js project
Here how to use the template [Github Template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template)

run this to install the dependency

```js
  npm install
```

Webpack configuration template for HTML, CSS, and Javascript project.
It will bundle: - Javascript - Img imported in js or html with link - CSS imported in js - HTML

There is two different webpack configuration depending on build that is production and development. and the common one will be used in both build.

All your code should be inside the src, otherwise bundler will throw an error, and the bundled file will be located inside the dist file. which is the file that we will deploy.

To use an img in js, you need to import it with the actual file path. otherwise it will be just an empty string

```js
import img from "./asset/resource/img.png";
const imgElement = document.createElement("img");
imgElement.src = img;
```

```js
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
      template: "./src/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};
```

- Specifying the entry point, which is the main file that dependant on
  other module (importing). the dependancy graph will look like this
  index.js <---- otherModule
  - The location of our bundle js file and it's path. and everytime we run
    the webpack, we want to clean the dist file first, so that it only contain the newest bundle
  - Plugin to bundle and inject our javascript into html
  - Module (Loader) that will
    - Look for any css import in js file and transform it into text (css loader) and from the text, applying it to the js (style loader)
    - Look for any img url path in our html (eg img with src), so that it will become proper path instead of regular string
    - Look for any img that was imported in the javascript and return the specified images

```js
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
```

- Merging our dev config with our common config
  - Using development mode and dev tool eval source map
    So that the error message will match the actual file and lines
    inctead of the bundled file
  - Using webpack dev serve so that any changes made to the bundled
    file, will recognized immediately without the need to run webpack
    on each change that we made

```js
const { default: merge } = require("webpack-merge");
const webpackCommon = require("./webpack.common");

module.exports = merge(webpackCommon, {
  mode: "production",
  devtool: "source-map",
});
```

- Merging the prod config with our common config
  - Using production mode (that will try to minimize the bundle size) and
    our error message will match the actual line and file instead of the bundled one

```js
  "scripts": {
    "start": "webpack serve --open --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js",
    "prebranch": "git branch gh-pages",
    "branch": "git checkout gh-pages && git merge main --no-edit && npm run build",
    "postbranch": "git add dist -f && git commit -m 'Deploy to github pages'",
    "push": "git subtree push --prefix dist origin gh-pages",
    "deploy": "npm run branch && npm run push"
  },
```

- start : Running our dev server with dev config

  - build : Bundle the project with prod config
  - prebranch : create new branch for deployment (run automatically before branch / Life cycle script)
  - branch : Switch to the new branch, merge it with our main branch and bundle our project
  - postbranch: add our dist file and commit it (run automatically after branch / Life cycle script)
  - push : Push the change of our dist fille into our new branch
  - deploy : run branch script if it's not error, then run push script

  - [Webpack merge](https://webpack.js.org/guides/production/) - On how to split the webpack config
  - [JSON Script](https://www.upgrad.com/blog/introduction-to-package-json-scripts-in-node-js/) - On how to use lifecycle script
  - [Odin project](https://www.theodinproject.com/lessons/node-path-javascript-restaurant-page) - On deploying the bundled dist to github
