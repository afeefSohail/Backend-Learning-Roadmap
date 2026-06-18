const express = require('express');
const path = require('path');
const app = express()
let { people } = require(path.join(__dirname,'../data.cjs'))
const port = 3000

app.use(express.static(path.join(__dirname, '../03-method-public')))

// Get => Read Data
app.get('/api/people', (req, res) => {
    res
    .status(200)
    .json({success: true, data: people})
})


app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}/`);
})