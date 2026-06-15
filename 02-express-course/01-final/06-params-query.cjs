const express = require('express');
const path = require('path');
const { products } = require(path.join(__dirname,'../data.cjs'))
const app = express()
const port = 3000

app.get('/', (req, res) => {
   return res.send('<h1> Home Page </h1><a href="/api/products"> Products </a>')
})

//Map Method
app.get('/api/products', (req, res) => {
    const newProducts = products.map((product) => {
        const {id, name, image} = product
        return {id, name, image}
    })

   return res.json(newProducts)
})

// Route Parameters
app.get('/api/products/:productID', (req, res) => {
    // console.log(req);
    // console.log(req.params); // [Object: null prototype] { productID: ':productId' }
    const { productID } = req.params
    const singleProduct = products.find((product) => product.id === Number(productID) )
    
    if (!singleProduct) {
        return res.status(404).send('Product Doest not Exist')
    }

    res.json(singleProduct)
})

app.get('/api/v1/query', (req, res) => {
    
})

app.get('/api/products/:productID/reviews/:reviewID', (req, res) => {
    console.log(req.params);
    res.send('hello world')
})


app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}/`);
})


// => https://hn.algolia.com/api
