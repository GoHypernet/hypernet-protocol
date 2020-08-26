const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname),
    entry: path.join(__dirname, 'src/index.ts'),
    output: {
        filename: 'index.js',
        path: path.join(__dirname, "/dist")
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        plugins: [new TsconfigPathsPlugin({})],
        alias: {
            "@interfaces": path.resolve(__dirname, "../hypernet-core/src/interfaces"),
            "@implementations": path.resolve(__dirname, "../hypernet-core/src/implementations"),
        }
    },
    devtool: "inline-source-map",
    devServer: {
        contentBase: path.join(__dirname, "src"),
        liveReload: true,
        compress: true,
        publicPath: "/",
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
};