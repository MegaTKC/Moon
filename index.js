const http = require('http');
const fs = require('fs');
const path = require('path');
const Corrosion = require('corrosion');

const server = http.createServer();
const proxy = new Corrosion({
    codec: 'xor',
    prefix: '/get/'
});

proxy.bundleScripts();

server.on('request', (request, response) => {
    const url = request.url;

    // Check if the request URL starts with the specified prefix
    if (url.startsWith(proxy.prefix)) {
        return proxy.request(request, response);
    }

    // Check if the request is for style.css
    if (url === '/style.css') {
        const cssPath = path.join(__dirname, '/style.css');
        response.writeHead(200, { 'Content-Type': 'text/css' });
        return fs.createReadStream(cssPath).pipe(response);
    }

    // For other requests, serve the index.html file
    const indexPath = path.join(__dirname, '/index.html');
    response.writeHead(200, { 'Content-Type': 'text/html' }); // Set Content-Type to 'text/html'
    response.end(fs.readFileSync(indexPath, 'utf-8'));
}).on('upgrade', (clientRequest, clientSocket, clientHead) => proxy.upgrade(clientRequest, clientSocket, clientHead)).listen(3000);
