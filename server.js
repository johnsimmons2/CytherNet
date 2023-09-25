const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path')

const app = express();

console.log('Starting node server...');

app.use(express.static(__dirname + '/dist/app'));

const apiProxy = createProxyMiddleware('/api', {
  target: 'http://127.0.0.1:5000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // Remove the '/api' prefix from the request path
  },

  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying request to: ${proxyReq.path}`);
  },

  onProxyRes: (proxyRes, req, res) => {
    // Buffer the response data as it streams
    let responseData = '';
    proxyRes.on('data', (chunk) => {
      responseData += chunk;
    });

    // Log the response body when it's complete
    proxyRes.on('end', () => {
      console.log('Response Body:', responseData);
    });
  }
});

app.use('/api', apiProxy);
app.listen(process.env.PORT || 8080);
