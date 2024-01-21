// Node has a built-in path module
// allows to use absolute file paths

// Use Common JS module syntax
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: 'development',
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'), // Use dist folder. Point from curr(__dirname) to dist
        filename: 'bundle.js' // Default: main.js
    },
    devServer: {
        static: {
            // Where we'll server from
            directory: path.resolve(__dirname, 'dist')
        },
        port: 3000, // Default: 8080; up to you
        open: true, // When run server, opens in browser immediately
        hot: true,
        compress: true, // For optimization
        historyApiFallback: true
    },
    module: {
        // Array
        rules: [
            // Each module has object
            {
                // Where you want loader to apply
                test: /\.css$/, // regex - anything that ends with .css

                // Used/Applied for any file that matches regex
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },

            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    }
                }
            }
        ]
    },
    // Create plugin array
    plugins: [
        // instance of html Object
        new HtmlWebpackPlugin({
            tile: 'Webpack App',
            filename: 'index.html', // For single html file where all routes happen in js
            template: './src/index.html' // or template.html
        }),
        new MiniCssExtractPlugin(),
    ]
};