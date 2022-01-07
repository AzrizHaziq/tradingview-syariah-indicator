import * as path from 'path'
import * as webpack from 'webpack'
import Dotenv from 'dotenv-webpack'
import SizePlugin from 'size-plugin'
import type { Configuration } from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import WindiCSSWebpackPlugin from 'windicss-webpack-plugin'
import MergeIntoSingleFilePlugin from 'webpack-merge-and-include-globally'

const isProd = () => process.env.NODE_ENV === 'production'
const dotEnvPath = isProd() ? './.env.production' : './.env'
require('dotenv').config({ path: dotEnvPath }) // eslint-disable-line @typescript-eslint/no-var-requires

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    clean: true,
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/',
    environment: { module: true },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new WindiCSSWebpackPlugin(),
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new Dotenv({ path: dotEnvPath }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'popup', 'index.html'),
      filename: 'popup/popup.html',
      chunks: ['popup/popup'],
      cache: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'assets', to: 'assets' },
        { from: '_locales', to: '_locales' },
        {
          from: 'manifest.json',
          to: path.join(__dirname, 'dist'),
          force: true,
          transform: function (content) {
            const manifestJson = JSON.parse(content.toString())
            const connectSelf = ['https://www.google-analytics.com', process.env.FETCH_URL].join(' ')

            const output = {
              version: process.env.npm_package_version,
              ...manifestJson,
              // write our FETCH_URL into csp
              content_security_policy: `${manifestJson.content_security_policy} connect-src 'self' ${connectSelf}`,
            }

            return JSON.stringify(output, null, 2)
          },
        },
      ],
    }),
    new MergeIntoSingleFilePlugin({
      files: { 'bg/bg.js': ['dist/browser-polyfill.js', 'dist/bg/background.js'] },
    }),
    new SizePlugin({ writeFile: false }),
    process.env.ENABLE_BA ? new BundleAnalyzerPlugin() : undefined,
  ].filter(Boolean),
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]solid-js[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
        'browser-polyfill': {
          test: /[\\/]node_modules[\\/]webextension-polyfill/,
          name: 'browser-polyfill',
          chunks: 'all',
        },
      },
    },
  },
})
