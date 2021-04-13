import path from 'path'
import Dotenv from 'dotenv-webpack'
import SizePlugin from 'size-plugin'
import webpack, { Configuration } from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

const isProd = () => process.env.NODE_ENV === 'production'
const dotEnvPath = isProd() ? './.env.production' : './.env'
require('dotenv').config({ path: dotEnvPath })

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
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      'webextension-polyfill-ts': path.resolve(
        path.join(__dirname, '../../', 'node_modules', 'webextension-polyfill-ts')
      ),
    },
  },
  plugins: [
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
              ...manifestJson,
              version: process.env.npm_package_version,
              // write our FETCH_URL into csp
              content_security_policy: `${manifestJson.content_security_policy} connect-src 'self' ${connectSelf}`,
            }

            return Buffer.from(JSON.stringify(output))
          },
        },
      ],
    }),
    new SizePlugin({ writeFile: false }),
    process.env.ENABLE_BA ? new BundleAnalyzerPlugin() : undefined,
  ].filter(Boolean),
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
        'browser-polyfill': {
          test: /[\\/]node_modules[\\/](webextension-polyfill-ts|webextension-polyfill)/,
          name: 'browser-polyfill',
          chunks: 'all',
        },
      },
    },
  },
})
