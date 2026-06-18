// https://hn.algolia.com/api
// you cannot send multiple response in same request.

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

    res.json(newProducts)
})

// Route Parameters
app.get('/api/products/:productID', (req, res) => {
    // console.log(req);
    // console.log(req.params); // [Object: null prototype] { productID: ':productId' }
    const { productID } = req.params
    const singleProduct = products.find((product) => product.id === Number(productID) )
    
    if (!singleProduct) {
        console.log(singleProduct);
        return res.status(404).send('Product Doest not Exist')
    }

    res.json(singleProduct)
})

app.get('/api/products/:productID/reviews/:reviewID', (req, res) => {
    console.log(req.params);
    res.send('hello world')
})

app.get('/api/v1/query', (req, res) => {
    //http://localhost:3000/api/v1/query?search=a&limit=2
    console.log(req.query); // [Object: null prototype] { search: 'a', limit: '2' }
    const { search, limit } = req.query
    let soretedproducts = [...products]

    if (search) {
        soretedproducts = soretedproducts.filter((product) => {
            return product.name.startsWith(search)
        })
    }

    if (limit) {
        soretedproducts = soretedproducts.slice(0, Number(limit))
    }
    
    if (soretedproducts.length > 0) {
        return res.status(200).json(soretedproducts)
    }

    res.status(200).json({success: true, data:[]})
})



app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}/`);
})