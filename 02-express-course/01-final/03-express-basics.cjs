const express = require('express')
const app = express();
const port = 3000;


app.get('/' , (req, res) => {
    res.status(200).send('Home Page')
})

app.get('/about', (req, res) => {
    res.status(200).send('About Page')
})

// what ever resouce you trying to access
app.all('*any', (req, res) => {
    res.status(404).send('<h1> resourse not found </h1>')
})

app.listen(port, () => {
    console.log(`Server is listening on port http://localhost:${port} ...`);
})

// app.get
// app.post
// app.put
// app.delete
// app.all
// app.use
// app.listen