const express = require('express')
const path = require('path')

const app = express();
const port = 3000;

/*
To make sure your static folder always 
loads correctly no matter where you or 
your deployment server launch the terminal, 
always tie it to __dirname using path.join() 
*/

// setup static assets with express middleware
app.use(express.static(path.join(__dirname, '../04-public')))

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../02-navbar-app/index.html'))
})

// what ever resouce you trying to access
app.all('*any', (req, res) => {
    res.status(404).send('<h1> resourse not found </h1>')
})

app.listen(port, () => {
    console.log(`Server is listening on port http://localhost:${port} ...`);
})