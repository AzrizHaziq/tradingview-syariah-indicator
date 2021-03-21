import path from 'path'
import Dotenv from 'dotenv-webpack'
import SizePlugin from 'size-plugin'
import { Configuration } from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

const isProd = () => process.env.NODE_ENV === 'production'

module.exports = (_environment: string, _: Record<string, boolean | number | string>): Configuration => ({
  devtool: 'source-map',
  stats: {
    all: false,
    errors: true,
    builtAt: true,
  },
  entry: {
    'page/chart': './src/page/chart',
    'page/screener': './src/page/screener',
    'page/symbols': './src/page/symbols',
    'bg/background': './src/bg/background',
    'popup/popup': './src/popup/popup',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: '[name].css',
    }),
    new Dotenv({
      path: isProd() ? './.env.production' : './.env',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'assets', to: 'assets' },
        { from: '_locales', to: '_locales' },
        {
          from: 'src',
          globOptions: {
            ignore: ['**/*.ts', '**/*.tsx', '**/*.scss'],
          },
        },
        // {
        //   from: '../../node_modules/webext-base-css/webext-base.css',
        //   to: 'options/',
        // },
        '../../node_modules/webextension-polyfill/dist/browser-polyfill.js',
        '../../node_modules/webextension-polyfill/dist/browser-polyfill.js.map',
      ],
    }),
    new SizePlugin({
      writeFile: false,
    }),
    new CleanWebpackPlugin(),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
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
