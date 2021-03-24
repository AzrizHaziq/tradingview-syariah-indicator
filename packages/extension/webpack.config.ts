import path from 'path'
import Dotenv from 'dotenv-webpack'
import SizePlugin from 'size-plugin'
import webpack, { Configuration } from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

const isProd = () => process.env.NODE_ENV === 'production'

module.exports = (_environment: string, _: Record<string, boolean | number | string>): Configuration => ({
  devtool: 'cheap-module-source-map',
  stats: {
    all: false,
    errors: true,
    builtAt: true,
  },
  entry: {
    'page/chart': path.join(__dirname, 'src', 'page', 'chart.ts'),
    'page/screener': path.join(__dirname, 'src', 'page', 'screener.ts'),
    'page/symbols': path.join(__dirname, 'src', 'page', 'symbols.ts'),
    'bg/background': path.join(__dirname, 'src', 'bg', 'background.ts'),
    'popup/popup': path.join(__dirname, 'src', 'popup', 'index.tsx'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      { test: /\.(ts|tsx)$/, loader: 'ts-loader', exclude: /node_modules/ },
      {
        test: /\.(js|jsx)$/,
        use: [{ loader: 'source-map-loader' }, { loader: 'babel-loader' }],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new Dotenv({ path: isProd() ? './.env.production' : './.env' }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'popup', 'index.html'),
      filename: 'popup/popup.html',
      chunks: ['popup/popup'],
      cache: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'manifest.json',
          to: path.join(__dirname, 'dist'),
          force: true,
          transform: function (content) {
            // generates the manifest file using the package.json informations
            return Buffer.from(
              JSON.stringify({
                ...JSON.parse(content.toString()),
                version: process.env.npm_package_version,
              })
            )
          },
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'assets', to: 'assets' },
        { from: '_locales', to: '_locales' },
        '../../node_modules/webextension-polyfill/dist/browser-polyfill.js',
        '../../node_modules/webextension-polyfill/dist/browser-polyfill.js.map',
      ],
    }),
    new SizePlugin({ writeFile: false }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'common',
    },
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          mangle: true,
          compress: true,
          output: {
            beautify: false,
            indent_level: 2,
          },
        },
      }),
    ],
  },
})
