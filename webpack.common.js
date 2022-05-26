const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    publicPath: 'auto'
  },
  module: {
    rules: [
      {
				test: /\.(pdf|png|jpg|jpeg|gif|ico|mp3|json)$/,
				type: 'javascript/auto',
				use: [
					{
						loader: 'file-loader',
						options: {},
					}
				],
			},
			{
        test: /\.(glsl|vert|frag)$/,
				use: [
					{
						loader: 'raw-loader',
						options: {},
					},
					{
						loader: 'glslify-loader',
						options: {},
					},
				],
      },
      {
        test: /\.(js|jsx)$/,
				exclude: /node_modules/,
        use: ['babel-loader'],
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Demo',
      template: path.resolve(__dirname, './src/template.html'),
      filename: 'index.html',
    }),
    new CleanWebpackPlugin(),
  ],
  
}
