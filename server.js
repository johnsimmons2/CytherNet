require('dotenv').config();


const { legacyCreateProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
const { MailtrapClient } = require('mailtrap');
const express = require('express');
const path = require('path');
const http = require('http');

const mailToken = process.env.MAILTRAP_TOKEN;
const mailEndpoint = process.env.MAILTRAP_ENDPOINT;

const mailClient = new MailtrapClient({endpoint: mailEndpoint, token: mailToken});
const mailSender = {
  email: "admin@cyther.online",
  name: "CytherNet Admin"
};

const app = express();

console.log('Starting node server...');

app.use(express.static(__dirname + '/dist/app/browser'));

const apiUrl = process.env.API_URL ?? 'http://127.0.0.1:5000/';
const apiHost = new URL(apiUrl).hostname;
const port = process.env.API_PORT ?? 5000;

console.log(`!Proxying API requests to (url: ${apiUrl})`);

const apiProxy = legacyCreateProxyMiddleware('/api', {
  target: 'http://127.0.0.1:5000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // Remove the '/api' prefix from the request path
  },

  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying request to: ${proxyReq.host + req.url}`);
    if (req.body) {
      // Fix the request body to be a string
      fixRequestBody(proxyReq, req.body);
    }
  },

  onProxyRes: (proxyRes, req, res) => {
    // Buffer the response data as it streams
    let responseData = '';
    proxyRes.on('data', (chunk) => {
      responseData += chunk;
    });

    // Log the response body when it's complete
    proxyRes.on('end', () => {
      if (responseData.length > 64) {
        console.log('Response Body:', responseData.slice(0, 64) + '...');
      } else {
        console.log('Response Body:', responseData);
      }
      console.log('Response Status:', proxyRes.statusCode);
    });
  }
});

app.use('/api', apiProxy);
app.route('/*').get(function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/app/browser/index.html'));
});

app.use(express.json());
app.listen(process.env.PORT ?? 8080);

console.log(`Listening to web on port ${process.env.PORT ?? 8080}, open browser to http://localhost:${process.env.PORT ?? 8080}`);
