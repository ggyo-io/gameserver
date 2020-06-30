const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const isDevelopment = process.env.NODE_ENV === 'development';
const path = require("path");

module.exports = {
    mode: 'none',
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    entry: {
        gameserver: path.resolve(__dirname, './src/index.js')
    },
    output: {
        path: path.resolve(__dirname , "./dist"),
        filename: isDevelopment ? "[name].bundle.js" : "[name].bundle.[hash].js",
        publicPath: ''
    },
    devServer: {
        historyApiFallback: true,
        proxy: [
            {
                context: ['/api'],
                target: 'http://localhost:8383',
            },
            {
                context: ['/ws'],
                target: 'ws://localhost:8383',
                ws: true,
            }]
    },
    module: {
        rules: [
            { test: /\.jsx$/, use: "babel-loader" },
            {
                test: /\.svg/,
                use: {
                    loader: 'svg-url-loader',
                }
            },
            {
                test: /\.module\.s(a|c)ss$/,
                loader: [
                    isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            sourceMap: isDevelopment
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isDevelopment
                        }
                    }
                ]
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg)(\?\S*)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/',
                        publicPath: '../fonts/'
                    }
                }]
            },
            {
                test: /\.s(a|c)ss$/,
                exclude: /\.module.(s(a|c)ss)$/,
                loader: [
                    isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isDevelopment
                        }
                    },
                ]
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(ico|png|jpe?g|gif)$/i,
                loader: 'file-loader',
                options: {
                    name(resourcePath) {
                        if (resourcePath.toString().includes('favicon.ico'))
                            return '[name].[ext]';
                        else
                            return isDevelopment ? '[path][name].[ext]' : '[contenthash].[ext]';
                    },
                },
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                        },
                    },
                ],
            },
            {
                test: /\.svg$/i,
                use: {
                    loader: 'react-svg-loader',
                    options: {
                        encoding: false
                    }
                }
            }
        ]
    },
    resolve: {
        modules: [
            path.resolve(__dirname, "src"),
            "node_modules"
        ],
        alias: {
            core: path.resolve(__dirname, 'src/core')
        },
        extensions: ['.js', '.jsx', '.scss']
    },
    devtool: 'inline-source-map',
    plugins: [
        new CleanWebpackPlugin(),
        new ManifestPlugin({
            publicPath: '',
            fileName: 'manifest.json'
        }),
        new CopyPlugin({
            patterns: [
                { from: 'src/assets/img/chesspieces/wikipedia/*.png',
                  to: 'img/chesspieces/wikipedia/',
                  flatten: true
                 },
                { from: 'src/assets/img/chesspieces/wikisvg/*.svg',
                  to: 'img/chesspieces/wikisvg/',
                  flatten: true
                 },
                { from: 'src/assets/img/chesspieces/merida/*.svg',
                  to: 'img/chesspieces/merida/',
                  flatten: true
                 }
          ],
        }),
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html",
        }),
        new MiniCssExtractPlugin({
            filename: isDevelopment ? '[name].css' : '[name].[hash].min.css',
            chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].min.css'
        })
    ]
};
