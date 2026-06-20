import express from 'express';
import type { Application, Request, Response } from "express";
const app: Application = express();
const port: number = 3000;


app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Home Page')
})

app.get('/about', (req: Request, res: Response) => {
    res.status(200).send('About Page')
})

// what ever resouce you trying to access
app.all('*any', (req: Request, res: Response) => {
    res.status(404).send('<h1> resourse not found </h1>')
})

app.listen(port, () => {
    console.log(`⚡️[server]: Server is actively processing traffic on http://localhost:${port}`);
})

// app.get
// app.post
// app.put
// app.delete
// app.all
// app.use
// app.listen