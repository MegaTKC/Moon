const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const Corrosion = require('corrosion');
const Unblocker = require('unblocker');

const app = express();

const proxy = new Corrosion({
    codec: 'plain',
    prefix: '/corr/'
});

proxy.bundleScripts();

app.use((req, res, next) => {
    const url = req.url;

    if (url.startsWith(proxy.prefix)) {
        return proxy.request(req, res);
    }

    next();
});

app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, '/index.html');
    res.setHeader('Content-Type', 'text/html');
    res.end(fs.readFileSync(indexPath, 'utf-8'));
});

app.use(express.static(path.join(__dirname, 'public')));

const unblocker = Unblocker({
    prefix: '/nub/',
    hostBlacklist: [],
});

app.use(unblocker);

const useSSL = false;

let server;

if (useSSL) {
    const sslOptions = {
        key: fs.readFileSync('ssl.key'),     // Path to your SSL private key
        cert: fs.readFileSync('ssl.cert'),   // Path to your SSL certificate
    };

    server = https.createServer(sslOptions, app);
} else {
    server = http.createServer(app);
}

server.listen(3000, () => {
    console.log(`Server is listening on port 3000${useSSL ? ' with SSL' : ''}`);
});

server.on('upgrade', (request, socket, head) => {
    proxy.upgrade(request, socket, head);
});
