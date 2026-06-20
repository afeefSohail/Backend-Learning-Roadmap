import http, { IncomingMessage , ServerResponse } from "http";
const port: number = 3000 

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {

    const url = req.url    
    // home page
    if (url === '/') {
        res.writeHead(200, { 'content-type': 'text/html' })
        res.write('<h1>home page</h1>')
        res.end()
    }
    // about page
    else if (url === '/about') {
        res.writeHead(200, { 'content-type': 'text/html' })
        res.write('<h1>about page</h1>')
        res.end()
    }
    // 404
    else {
        res.writeHead(404, { 'content-type': 'text/html' })
        res.write('<h1>page not found</h1>')
        res.end()
    }
})

/* 
server.listen() is an action command.
 It tells your server to bind itself 
 to a specific port number on your machine 
 and start waiting for incoming web requests 
 from the internet.
*/
server.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}/`);    
})