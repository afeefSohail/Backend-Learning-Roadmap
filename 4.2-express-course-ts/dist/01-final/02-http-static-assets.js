import http, { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';
import { getPaths } from '#utils/path';
import { readFileSync } from 'node:fs';
const { __dirname } = getPaths(import.meta.url);
const port = 3000;
// 🌟 Pre-load file assets into Buffer variables in memory
// Note: Since we are in 03-express-course-ts/src, adjust dots if your navbar folder moved!
const navbarDir = path.resolve(__dirname, '../02-navbar-app');
const homePage = readFileSync(path.join(navbarDir, 'index.html'));
const homeStyles = readFileSync(path.join(navbarDir, 'styles.css'));
const homeImage = readFileSync(path.join(navbarDir, 'logo.svg'));
const homeLogic = readFileSync(path.join(navbarDir, 'browser-app.ts'));
const server = http.createServer((req, res) => {
    const url = req.url;
    console.log(`Browser requested URL: ${url}`);
    // Route 1: Serve the main web template structure
    if (url === '/' || url === '/index.html') {
        res.writeHead(200, { 'content-type': 'text/html' });
        res.write(homePage);
        res.end();
        return;
    }
    if (url === '/about') {
        res.writeHead(200, { 'content-type': 'text/html' });
        res.write('<h1>about page</h1>');
        res.end();
        return;
    }
    // Route 2: Serve the CSS styles
    if (url === '/styles.css') {
        res.writeHead(200, { 'content-type': 'text/css' });
        res.write(homeStyles);
        res.end();
        return;
    }
    // Route 3: Serve the branding SVG image logo
    if (url === '/logo.svg') {
        res.writeHead(200, { 'content-type': 'image/svg+xml' });
        res.write(homeImage);
        res.end();
        return;
    }
    // Route 4: Serve the client-side JavaScript logic file
    if (url === '/browser-app.ts') {
        res.writeHead(200, { 'content-type': 'text/typescript' });
        res.write(homeLogic);
        res.end();
        return;
    }
    // Fallback 404 Route for missing links
    res.writeHead(404, { 'content-type': 'text/html' });
    res.write('<h1>Resource not found</h1>');
    res.end();
});
server.listen(port, () => {
    console.log(`⚡️[server]: Server is actively processing traffic on http://localhost:${port}`);
});
//# sourceMappingURL=02-http-static-assets.js.map