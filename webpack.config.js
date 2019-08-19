'use strict';

const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: path.resolve(__dirname, './frontend/index.js'),

    output: {
        path: path.resolve(__dirname, 'report'),
        filename: 'bundle.js'
    },

    plugins: [
        new webpack.ProgressPlugin()
    ],

    module: {
        rules: [
            {
                test: /.(js|jsx)$/,
                include: [path.resolve(__dirname, './frontend')],
                loader: path.resolve(__dirname, 'node_modules', 'babel-loader'),

                options: {
                    presets: [
                        path.resolve(__dirname, 'node_modules', '@babel/preset-env'),
                        path.resolve(__dirname, 'node_modules', '@babel/preset-react')
                    ]
                }
            },
            {
                test: /\.styl|\.css$/,
                use: [
					{loader: path.resolve(__dirname, 'node_modules', 'style-loader')},
					{loader: path.resolve(__dirname, 'node_modules', 'css-loader')},
					{loader: path.resolve(__dirname, 'node_modules', 'stylus-loader')}
                ]
            }
        ]
    }

};
