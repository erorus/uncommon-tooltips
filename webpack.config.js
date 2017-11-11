const BannerWebpackPlugin = require('banner-webpack-plugin');
const PACKAGE = require('./package.json');

module.exports = {
    entry: ['promise-polyfill','whatwg-fetch','./src/main.js'],
    output: {
        filename: 'out/uncommon-tooltips.js'
    },
    plugins: [
        new BannerWebpackPlugin({
            chunks: {
                'main': {
                    beforeContent:
`/**
 * Uncommon Tooltips v${PACKAGE.version}
 * ${PACKAGE.description}
 * by ${PACKAGE.author}
 *
 * https://www.uncommon-tooltips.com/
 */
`
                }
            }
        }),
    ],
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader'
        }]
    }
};