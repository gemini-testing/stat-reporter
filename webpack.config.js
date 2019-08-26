'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './lib/static/index.js',

    output: {
        path: path.resolve(__dirname, 'lib/static/dist'),
        filename: 'bundle.js'
    },

    plugins: [
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve('lib/static/template.html')
        })
    ],

    module: {
        rules: [
            {
                test: /.js$/,
                include: [path.resolve('lib/static')],
                loader: 'babel-loader',

                options: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-react'
                    ]
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }

};
