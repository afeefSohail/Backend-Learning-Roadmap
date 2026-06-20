import type { Request, Response } from "express";

const login = (req: Request, res: Response) => {
    const { name } = req.body;
    if (name) {
        return res
            .status(200)
            .send(`<div>Welcome ${name}</div>`)
    }
    res.
        status(401)
        .send(`<div>Please Provide Credentials</div>`)
}

export { login }