const path = require('path');
const fs = require('fs');
const express = require('express');
const https = require('https');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// app.use((req, res, next) => {
//   if (!req.secure) {
//     return res.redirect(`https://${req.hostname}:${app.get('sslPort')}${req.url}`);
//   }
//   next();
// });

app.use('/api', createProxyMiddleware({
  target: 'http://server:3000', changeOrigin: false
  // target: 'http://www.baidu.com', changeOrigin: true
}));

const clientPath = path.join(__dirname, 'client');
// const adminPath = path.join(__dirname, 'admin');

// app.use('/admin', express.static(adminPath))
app.use('/', express.static(clientPath))

// const privateKey = fs.readFileSync(path.join(__dirname, 'ssl', 'ssl.key'), 'utf8');
// const certificate = fs.readFileSync(path.join(__dirname, 'ssl', 'ssl.pem'), 'utf8');

// 创建 HTTPS 服务器
// const credentials = { key: privateKey, cert: certificate };
// const httpsServer = https.createServer(credentials, app);

// app.set('sslPort', 443);

// httpsServer.listen(app.get('sslPort'), () => {
//   console.log(`HTTPS server running on port ${app.get('sslPort')}`);
// });

const port = 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})