// const http = require('http')
// const { readFileSync } = require('fs')
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs'

// ES Modules: 1. Recreate the absolute directory path of your "03-Modules" folder
const __filename = fileURLToPath(import.meta.url); // path => /Users/afeefsohail/Documents/My Projects/Node.js_Express.js/02-express-course/01-final/02-http-static-assets.js
const __dirname = path.dirname(__filename); // path => root dir path (01-final)
console.log("File Path => ", __filename);
console.log("Dir Path => ",__dirname);

// get all files
const homePage = readFileSync(path.resolve(__dirname, '../02-navbar-app/index.html'))
const homeStyles = readFileSync(path.resolve(__dirname, '../02-navbar-app/styles.css'))
const homeImage = readFileSync(path.resolve(__dirname, '../02-navbar-app/logo.svg'))
const homeLogic = readFileSync(path.resolve(__dirname, '../02-navbar-app/browser-app.js'))

const server = http.createServer((req, res) => {
  // console.log(req.method)
  const url = req.url
  console.log(`Browser requested URL: ${url}`);

  // Route 1: Serve the main web template structure
  if (url === '/' || url === '/index.html') {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.write(homePage);
    return res.end();
  }
  
  if (url === '/about') {
    res.writeHead(200, { 'content-type': 'text/html' })
    res.write('<h1>about page</h1>')
    return res.end()
  }

  // Route 2: Serve the CSS styles (This fixes your bulleted list layout!)
  if (url === '/styles.css') {
    res.writeHead(200, { 'content-type': 'text/css' }); // Tells browser this is code styling
    res.write(homeStyles);
    return res.end();
  }

  // Route 3: Serve the branding SVG image logo
  if (url === '/logo.svg') {
    res.writeHead(200, { 'content-type': 'image/svg+xml' }); // Tells browser this is an image asset
    res.write(homeImage);
    return res.end();
  }

  // Route 4: Serve the client-side JavaScript logic file
  if (url === '/browser-app.js') {
    res.writeHead(200, { 'content-type': 'text/javascript' }); // Tells browser this is execution code
    res.write(homeLogic);
    return res.end();
  }

  // Fallback 404 Route for missing links
  res.writeHead(404, { 'content-type': 'text/html' });
  res.write('<h1>Resource not found</h1>');
  res.end();
});

server.listen(3000, () => {
  console.log('Server is actively processing traffic on\nlink: http://localhost:3000');
});
