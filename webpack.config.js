const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: ['promise-polyfill','whatwg-fetch','./src/main.js'],
    output: {
        filename: 'out/uncommon-tooltips.js'
    },
    plugins: [
        //new UglifyJSPlugin()
    ],
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader'
        }]
    }
};