import express from 'express';
import type { Application, Request, Response } from "express";
import { logger , authorize } from '#data';
const app: Application = express()
const port: number = 3000

// req => Middleware Functions => res
// app.use([logger, authorize]) => this add middleware from this link http:localhost:3000/
app.use("/api", [logger, authorize])
 
app.get('/', (req: Request, res: Response) => {
    res.send('Home')
})

app.get('/about', (req: Request, res: Response) => {
    res.send('About')
})

app.get('/api/products', (req: Request, res: Response) => {
    console.log(req.query,"\n");
    res.send('Products')
})

app.get('/api/items', (req: Request, res: Response) => {
    console.log(req.query);
    res.send('Items')
})

app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}/`);
})