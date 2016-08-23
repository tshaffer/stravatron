module.exports = {

    entry: './scripts/index.js',
    output: {
        path: './build',
        filename: 'bundle.js'
    },
    devtool: "source-map",
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ['react', 'es2015']
            }
        },
            {
                test: /\.json?$/,
                loader: 'json'
            }]
    }
}
