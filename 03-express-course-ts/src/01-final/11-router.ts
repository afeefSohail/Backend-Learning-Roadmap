import express from 'express'
import path from 'node:path';
import peopleRouter from '#routes/people';
import authRouter from '#routes/auth';
import { getPaths } from '#utils/path';

const app = express()
const port = 3000
const { __dirname } = getPaths(import.meta.url);

// static assets
app.use(express.static(path.join(__dirname, '../03-method-public')))
// parse form data
app.use(express.urlencoded({ extended: false }))
// parse json
app.use(express.json())

app.use('/api/people', peopleRouter)
app.use('/login', authRouter)

app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}/`);
})