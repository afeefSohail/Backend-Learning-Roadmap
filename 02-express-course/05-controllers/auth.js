const login = (req, res) => {
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