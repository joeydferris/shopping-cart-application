const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development', // or 'production'
  // TODO: Add production optimizations later
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true, // Cleans the 'dist' folder before each build
    publicPath: '/',
  },
  plugins: [
    function () {
      this.hooks.done.tap('GenerateStats', (stats) => {
        fs.writeFileSync(
          path.resolve(__dirname, 'stats.json'),
          JSON.stringify(stats.toJson({ all: true }), null, 2)
        );
      });
    },
    new HtmlWebpackPlugin({
      template: './src/index.html', // Path to your HTML template file
      filename: 'index.html', // The name of the generated HTML file in the 'dist' directory
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css', // CSS files will be in 'dist/css/'
    }),
    // webpack-dev-server enhancement plugins
    new DashboardPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  // Add loaders and plugins as needed (e.g., for Babel, CSS, assets)
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource', // Emits the asset to the output directory
        generator: {
          filename: 'images/[name][ext][query]', // Customizes the output filename and path within the output directory
        },
      },
    ],
  },
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    open: true,
    client: {
      logging: 'verbose',
    },
    static: [
      {
        directory: path.join(__dirname, 'public'),
        publicPath: '/assets',
      },
      {
        directory: path.join(__dirname, 'src', 'assets', 'css'),
        publicPath: '/css',
      },
      {
        directory: path.join(__dirname, 'src', 'assets', 'images'),
        publicPath: '/images',
      },
      {
        directory: path.join(__dirname, 'other-static-files'),
        publicPath: '/files',
      },
    ],
  },
};
