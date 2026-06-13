const express = require('express');
const path = require('path');
const { products } = require(path.join(__dirname,'../data.cjs'))
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.json( products )
})

app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}/`);
    
})