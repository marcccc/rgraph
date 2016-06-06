var PROD = process.argv.indexOf('-p') >= 0;

module.exports = {
    entry: {
        rgraph:'./src/rgraph.js'   
    },
    output: {
        libraryTarget: 'umd',
        library: 'RGraph',
        path: __dirname + '/build/',
        filename: PROD ? '[name].min.js' : '[name].js'
    }
};
