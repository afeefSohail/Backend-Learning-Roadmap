import express from 'express';
import type { Request, Response } from "express";
import { products } from '#data';
const app = express()
const port = 3000

app.get('/', (req: Request, res: Response) => {
    res.json( products )
})

app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}/`);
    
})