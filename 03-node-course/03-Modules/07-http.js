//const http = require('http');
import http from 'http';

const server = http.createServer((req, res) => {
    //console.log(req);
    if (req.url === '/') {
        return res.end('welcome to our home page')
    }

    if (req.url === '/about') {
        return res.end('Here is our short history')
    }

    res.end(`
        <h1>Oops!</h1>
        <p>We can't seem to find the page your are looking for</p>
        <a href="/"> back home </a>
    `)
})

server.listen(3000)