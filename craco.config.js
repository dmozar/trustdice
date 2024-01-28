const path = require('path');
module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    module: {
      rules: [
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'svg-url-loader',
              options: {
                limit: 10240,
                // make all svg images to work in IE
                iesafe: true,
              },
            },
          ],
        }
      ]
    }
  },
};