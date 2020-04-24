const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin");

const production = process.env.NODE_ENV === 'production';
const host = process.env.HOST || 'localhost';
const devServerPort = 9000;

class CleanUpExtractCssChunks {
    shouldPickStatChild(child) {
        return child.name.indexOf('extract-css-chunks-webpack-plugin') !== 0;
    }
    apply(compiler) {
        compiler.hooks.done.tap('CleanUpExtractCssChunks', (stats) => {
            const children = stats.compilation.children;
            if (Array.isArray(children)) {
                // eslint-disable-next-line no-param-reassign
                stats.compilation.children = children
                    .filter(child => this.shouldPickStatChild(child));
            }
        });
    }
}

const config = {
    mode: 'development',
    entry: {
        application: path.resolve(__dirname, './src/application.js'),
    },
    devtool: 'inline-source-map',
    devServer: {
        port: devServerPort,
        contentBase:  path.join(__dirname, 'dist'),
        compress: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        publicPath: '/',
        inline: false,
        index: 'index.html'
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-object-rest-spread']
                    }
                }
            },
            { test: /\.jsx$/, use: "babel-loader" },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                test: /\.svg$/i,
                use: ['svg-url-loader']
            },
            // {
            //     test: /\.svg$/i,
            //     use: [
            //         {
            //             loader: 'url-loader',
            //             options: {
            //                 encoding: false,
            //             },
            //         },
            //     ],
            // },
            {
                test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)|\.otf($|\?)/,
                //use: production ? 'file-loader' : 'url-loader'
                use: 'file-loader'
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.css$/i,
                use: ['style-loader','css-loader'],
                // options: {
                //     import: true,
                // },
            },
        ]
    },
    plugins: [
        new ExtractCssChunks(
            {
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: production ? "[name]-[chunkhash].css" : "[name].t.css",
                chunkfilename: production ? "[name]-[id].css" : "[name].css",
                path: path.resolve(__dirname, './dist'),
                publicPath: './',
            }
        ),
        new CleanUpExtractCssChunks(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Development',
            template: './src/index.html',
            publicPath: '/'
        }),
    ],
    output: {
        filename: production ? '[name]-[chunkhash].js' : '[name].js',
        chunkFilename: production ? '[name]-[chunkhash].js' : '[name].js',
        path: __dirname + '/dist',
        publicPath: '/'
    },
    resolve: {
        modules: [
            path.resolve(__dirname, "..", "/dist"),
            path.resolve(__dirname, "./", "node_modules")
        ],
        extensions: [".es6", ".jsx", ".sass", ".css", ".js"],
        alias: {
            'src': path.resolve(__dirname, '.', './src'),
            'js': path.resolve(__dirname, '.', './src/js'),
            'css': path.resolve(__dirname, '.', './src/css'),

        }
    },
};
module.exports = config;