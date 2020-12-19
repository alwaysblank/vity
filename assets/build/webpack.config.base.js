const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

const cache = isProd
    ? {
        type: 'filesystem',
        cacheDirectory: path.resolve(__dirname, '..', '..', '.webpack')
    }
    : true; // in-memory caching

module.exports = {
    cache: cache,
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '..', '..', 'site', '_build'),
        publicPath: "/",
    },
    mode: process.env.NODE_ENV || 'development',
    devtool: isProd ? false : 'eval-cheap-module-source-map',
    stats: 'errors-only',
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new ImageMinimizerPlugin({
            cache: true,
            minimizerOptions: {
                plugins: [
                    /**
                     * These settings are for *lossless* optimization, so don't
                     * expect huge gains (or losses in this case, I guess).
                     * More focused image optimization is left as an exercise
                     * for the developer; this is just here to make sure any
                     * easy, harmless optimizations aren't missed.
                     */
                    ['jpegtran', {progressive: true}],
                    ['optipng', {optimizationLevel: 5}],
                    [
                        'svgo',
                        {
                            plugins: [
                                {
                                    removeViewBox: false,
                                },
                            ],
                        },
                    ],
                ],
            },
        }),
    ],
    module: {
        rules: [
            {
                test: /\.?pcss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        },
                    },
                    'postcss-loader',
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    name: 'comp/[name].[ext]',
                },
            }
        ]
    }
}
