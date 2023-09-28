const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path')

const app = express();

console.log('Starting node server...');

app.use(express.static(__dirname + '/dist/app'));

const apiUrl = process.env.API_URL || 'localhost:5000';

console.log(`Proxying API requests to (url: ${apiUrl})`);

const apiProxy = createProxyMiddleware('/api', {
  target: apiUrl,
  changeOrigin: true,
  secure: true,
  headers: {
    Host: apiUrl,
  },
  pathRewrite: {
    '^/api': '', // Remove the '/api' prefix from the request path
  },

  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying request to: ${proxyReq.path}, ${proxyReq.host}`);
    console.log(`  Headers: ${JSON.stringify(proxyReq.getHeaders())}`);
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
      console.log('Response Status:', proxyRes.statusCode);
      console.log('Requested to:', req.path)
    });
  }
});

app.use('/api', apiProxy);
app.listen(process.env.PORT || 8080);
