const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        include: path.resolve(
          __dirname,
          'node_modules/@mindfiredigital/page-builder/dist/styles'
        ),
      },
    ],
  },
};
