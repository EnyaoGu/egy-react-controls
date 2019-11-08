const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = function (env = '') {
	return {
		entry: './src/index.js',
		mode: env === 'prod' ? 'production' : 'development',
		watch: env === 'watch',
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /(node_modules)/,
					loader: 'babel-loader',
					options: { presets: ['@babel/react', '@babel/env'] }
				},
				{
					test: /\.module\.css$/,
					use: [
						'style-loader',
						'css-loader?modules',
					],
				},
				{
					test: /(?<!\.module)\.css/,
					use: [
						'style-loader',
						'css-loader',
					],
				},
				{
					test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
					loader: 'url-loader',
				}
			]
		},
		resolve: { extensions: ['*', '.js', '.css'] },
		output: {
			path: path.resolve(__dirname, 'dist/'),
			publicPath: '/',
			filename: 'bundle.js'
		},
		devServer: {
			host: '0.0.0.0',
			port: 2077,
		},
		plugins: [
			new CleanWebpackPlugin({
				cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, 'dist', '*')],
			}),
			new HtmlWebpackPlugin({
				template: path.resolve(__dirname, 'src', 'index.html'),
				filename: path.resolve(__dirname, 'dist', 'index.html'),
				inject: 'head',
			}),
		],
		optimization: {
			splitChunks: {
				cacheGroups: {
					commons: {
						test: /[\\/]node_modules[\\/]/,
						name: 'assets',
						chunks: 'all',
					},
				},
			},
			minimizer: env === 'prod' ? [
				new UglifyJsPlugin({
					parallel: true,
				}),
				new OptimizeCSSAssetsPlugin({}),
			] : undefined,
		},
};
}