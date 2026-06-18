const express = require('express')
const path = require('path');
const app = express()
const port = 3000

const peoplePath = path.join(__dirname, '../04-routes/people.cjs');
const people = require(peoplePath)
const authPath = path.join(__dirname, '../04-routes/auth.cjs');
const auth = require(authPath)

// static assets
app.use(express.static(path.join(__dirname, '../03-method-public')))
// parse form data
app.use(express.urlencoded({ extended: false }))
// parse json
app.use(express.json())

app.use('/api/people', people)
app.use('/login', auth)

app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}/`);
})