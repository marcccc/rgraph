var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['./src/rgraph'],
    output: {
        libraryTarget: 'umd',
        library: 'RGraph',
        path: __dirname + '/build/',
        filename: 'rgraph.js'
    }/*,
    plugins: [
        new HtmlWebpackPlugin({
            template: 'test/index.html',
            filename: 'index.html'
        })
    ]*/
};
