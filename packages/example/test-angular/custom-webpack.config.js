module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/, // Process CSS files
        use: ['style-loader', 'css-loader'],
        include: /node_modules/, // Ensure it applies to node_modules
      },
    ],
  },
};
