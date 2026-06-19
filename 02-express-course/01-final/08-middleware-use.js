import express from 'express';
import { logger , authorize } from '#data';
const app = express()
const port = 3000

// req => Middleware Functions => res
// app.use([logger, authorize]) => this add middleware from this link http:localhost:3000/
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