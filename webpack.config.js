const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// paths
const SRC = './app/src';
const ENTRY = `${SRC}/js/main`;
const BUILD = './app/build';

// util
const env = process.env.NODE_ENV || 'development';

// modules 
webpackConfig = {
	entry: [
		ENTRY
	],
	output: {
		path: path.join(__dirname, BUILD),
		publicPath : BUILD,
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				include: path.join(__dirname, 'app/src/js')
			},
			{
				test    : /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: ["css-loader?minimize", "postcss-loader", "sass-loader"]
				})
			},
			{ test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }
		]
	},
	devtool: 'source-map',
	devServer: {
		contentBase: path.join(__dirname, "./app/"),
		publicPath: '/build/',
		compress: true,
		port: 3000,
		host: '0.0.0.0'
	},
	plugins: [
		new ExtractTextPlugin({
			filename: "styles.css",
			allChunks: true
		})
	]
}

if(env === 'production') {
	webpackConfig.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			compress : {
				unused    : true,
				dead_code : true,
				warnings  : false
			}
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
		})
	)
}

module.exports = webpackConfig;