const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

let pathsToClean = [
    'dist'
];

let cleanOptions = {
    root: __dirname,
    verbose: false,
    dry: false
};

module.exports = {
    entry: './src/index.js',

    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        port: 8080,
        contentBase: path.resolve(__dirname),
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.(scss|css)$/,

                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(pathsToClean, cleanOptions),
        new UglifyJSPlugin({sourceMap: true}),
        new HtmlWebpackPlugin({template: './src/index.html'}),
        new FaviconsWebpackPlugin('./src/favicon.png')
    ]
};
