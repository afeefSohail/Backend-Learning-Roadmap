const express = require('express');
const app = express()
const path = require('path');
const { logger , authorize } = require(path.join(__dirname,'../data.cjs'))
const port = 3000

// req => Middleware Functions => res
app.use("/api", [logger, authorize])
 
app.get('/', (req, res) => {
    res.send('Home')
})

app.get('/about', (req, res) => {
    res.send('About')
})

app.get('/api/products', (req, res) => {
    console.log(req.user);
    res.send('Products')
})

app.get('/api/items', (req, res) => {
    console.log(req.user);
    res.send('Items')
})

app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}/`);
})