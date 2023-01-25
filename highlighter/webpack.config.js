const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

const path = require('path');
const webpack = require('webpack');


module.exports = (env, argv) => ({
    mode: argv.mode === 'production' ? 'production' : 'development',

    devtool: false, // argv.mode === 'production' ? false : 'inline-source-map',

    entry: {
        edit: './src/edit/edit.js', // The entry point for your UI code
        view: './src/view/view.js', // The entry point for your UI code
    },

    module: {
        rules: [

            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-react", "@babel/preset-env"],
                        plugins: [
                            ["@babel/plugin-transform-runtime"],
                            [
                                "@babel/plugin-transform-react-jsx",
                                {
                                    pragma: "h",
                                    pragmaFrag: "Fragment",
                                },
                            ],
                        ],
                    },
                },
            },

            // Enables including CSS by doing "import './file.css'" in your TypeScript code
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            // Allows you to use "<%= require('./file.svg') %>" in your HTML code to get a data URI
            // { test: /\.(png|jpg|gif|webp|svg|zip)$/, loader: [{ loader: 'url-loader' }] }
            {
                test: /\.svg/,
                type: 'asset/inline'
            }
        ]
    },

    // Webpack tries these extensions for you if you omit the extension like "import './file'"
    resolve: { extensions: ['.tsx', '.ts', '.jsx', '.js'] },

    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'), // Compile into a folder called "dist"
    },

    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },

    // Tells Webpack to generate "edit.html" and to inline "view.ts" into it
    plugins: [
        new webpack.DefinePlugin({
            'global': {} // Fix missing symbol error when running in developer VM
        }),
        new HtmlWebpackPlugin({
            inject: 'body',
            template: path.resolve('src/view/view.html'),
            filename: 'view.html',
            chunks: ['view']
        }),
        new HtmlWebpackPlugin({
            inject: 'body',
            template: path.resolve('src/edit/edit.html'),
            filename: 'edit.html',
            chunks: ['edit']
        }),
        new HtmlInlineScriptPlugin(),
    ],
})