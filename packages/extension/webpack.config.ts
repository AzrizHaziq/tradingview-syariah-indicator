import path from 'path'
import SizePlugin from 'size-plugin'
import { Configuration } from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

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
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src',
          globOptions: {
            ignore: ['**/*.ts', '**/*.tsx'],
          },
        },
        // {
        //   from: '../../node_modules/webext-base-css/webext-base.css',
        //   to: 'options/',
        // },
        { from: '_locales', to: '_locales' },
        { from: 'assets', to: 'assets' },
        '../../node_modules/webextension-polyfill/dist/browser-polyfill.js',
        '../../node_modules/webextension-polyfill/dist/browser-polyfill.js.map',
      ],
    }),
    new SizePlugin({ writeFile: false }),
    new CleanWebpackPlugin(),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    minimizer: [
      // @ts-ignore
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
