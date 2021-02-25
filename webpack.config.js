const HTMLPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const MinifyPlugin = require("babel-minify-webpack-plugin")

module.exports = {

	plugins: [
		new HTMLPlugin({
			template: "./src/index.html",
			filename: "./index.html"
		}),
		new HTMLPlugin({
			template: "./src/a-propos.html",
			filename: "./a-propos.html"
		}),
		new HTMLPlugin({
			template: "./src/projets.html",
			filename: "./projets.html"
		}),
		new HTMLPlugin({
			template: "./src/contact.html",
			filename: "./contact.html"
		}),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: "[name].css"
		}),
		new MinifyPlugin()
	],
	module: {
		rules: [
			{
				test: /\.m?js$/,
				test: /\.(html)$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env']
					},
					loader: 'html-loader',
					options: {
						minimize: true
					}
				}
			},
			{ test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
			{
				test: /\.css$/,
				use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader, // creates style nodes from JS strings
					{
						loader: 'css-loader',
						options: { importLoaders: 1 }
					},
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
							plugins: (loader) => [
								require('autoprefixer')({
									browsers: ['last 2 versions', 'ie > 8']
								})
							],
							minimize: true
						}
					},
					"sass-loader" // compiles Sass to CSS, using Node Sass by default
				]
			}
		]
	},
	optimization: {
		minimizer: [
			new OptimizeCSSAssetsPlugin({
				assetNameRegExp: /main.css$/,
				 cssProcessor: require('cssnano'),
			})
		]
	}
}
