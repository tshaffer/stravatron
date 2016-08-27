module.exports = {

    entry: './scripts/index.js',
    output: {
        path: './build',
        filename: 'bundletron.js'
    },
    devtool: "source-map",
    target: 'electron',
    module: {
        preLoaders: [
            {
                test: /\.jsx$|\.js$/,
                loader: 'eslint-loader',
                include: __dirname + '/scripts',
                exclude: /build\.js$/
            }
        ],
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
