import http from 'http';

const server = http.createServer((req, res) => {
    console.log('request event')
    res.end('Hello World')

})

// listen is asynchronous
server.listen(3000, () => {
    console.log('Server listening on part: 3000');
})