const loaders = {
  JS: (options) => ({
    test: /\.(ts|js)x?$/,
    exclude: /node_modules/,
    use: [{ loader: 'babel-loader', options }],
  }),
  Images: (options = {}) => ({
    test: /\.(jpe?g|png|gif|ico)$/,
    use: [
      {
        loader: 'file-loader',
        options: { name: '[name].[ext]', outputPath: 'images', ...options },
      },
    ],
  }),
};

module.exports = {
  loaders,
};
