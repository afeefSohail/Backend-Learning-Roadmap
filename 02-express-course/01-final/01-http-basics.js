import http from 'node:http';

const server = http.createServer((req, res) => {
    console.log('user hit the server'); 
})

server.on(3000, () => {

})