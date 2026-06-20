import express from 'express';
import type { Request, Response, Application } from 'express';
import path from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import { people } from '#data'
import { getPaths } from '#utils/path';

const app: Application = express()
const port = 3000
const { __dirname } = getPaths(import.meta.url);
const dataFilePath = path.join(__dirname, '../data.ts');

// load static assets
app.use(express.static(path.join(__dirname, '../03-method-public')))
// parse form data
app.use(express.urlencoded({ extended: false })) // Content-Type: application/x-www-form-urlencoded
// parse json
app.use(express.json())

// POST => Insert Data By Frontend Input
app.post('/login', (req: Request, res: Response) => {
    const { name } = req.body;
    if (name) {
        return res
            .status(200)
            .send(`<div>Welcome ${name}</div>`)
    }
    res.
        status(401)
        .send(`<div>Please Provide Credentials</div>`)
})


// Get => Read Data
app.get('/api/people', (req: Request, res: Response) => {
    res.status(200).json({ success: true, data: people })
})

// Get => Read Data
app.get('/api/people/:id', (req: Request, res: Response) => {
    const { id } = req.params

    const person = people.find((p) => p.id === Number(id))

    if (!person) {
        return res
            .status(404)
            .json({ success: false, msg: `No person found with id ${id}` })
    }


    console.log(person.id, person.name);

    // Send back the updated information cleanly
    return res
        .status(200)
        .json({ success: true, data: person })
})

// POST => Insert Data
app.post('/api/people/postman', (req, res) => {
    const { name } = req.body
    if (!name) {
        return res
            .status(400).json({ success: false, msg: `please provide name value` })
    }

    const person = { id: people.length + 1, name: name }
    people.push(person)

    try {

        // 2. Read the entire raw code text from your physical file layout
        let fileContent = readFileSync(dataFilePath, 'utf-8');

        // 3. Create a clean replacement text block string for the people section
        const objectLines = people.map(person => {
            return `  { id: ${person.id}, name: '${person.name}' }`;
        });

        // 4. Assemble the array block text perfectly matching John's structure
        const newPeopleSection = `const people = [\n${objectLines.join(',\n')}\n]`;


        // 5. Swap the old array layout block with the new custom code text block
        fileContent = fileContent.replace(/const people = \[\s*[\s\S]*?\s*\]/g, newPeopleSection);

        // 6. Overwrite the file synchronously
        writeFileSync(dataFilePath, fileContent, 'utf-8');

        // 7. Return response tracking confirmation
        return res.status(201).json({ success: true, data: people });
    } catch (error) {
        console.error('File write failed:', error);
        return res.status(500).json({ success: false, msg: 'Failed to write data to file' });
    }
})

// Put => Update Data
app.put('/api/people/:id', (req: Request, res: Response) => {
    const { id } = req.params
    const { name } = req.body
    const person = people.find((p) => p.id === Number(id))

    if (!person) {
        return res
            .status(404)
            .json({ success: false, msg: `No person found with id ${id}` })
    }

    person.name = name
    console.log(people);

    try {

        // 2. Read the entire raw code text from your physical file layout
        let fileContent = readFileSync(dataFilePath, 'utf-8');

        // 3. Create a clean replacement text block string for the people section
        const objectLines = people.map(person => {
            return `  { id: ${person.id}, name: '${person.name}' }`;
        });

        // 4. Assemble the array block text perfectly matching John's structure
        const newPeopleSection = `const people = [\n${objectLines.join(',\n')}\n]`;


        // 5. Swap the old array layout block with the new custom code text block
        fileContent = fileContent.replace(/const people = \[\s*[\s\S]*?\s*\]/g, newPeopleSection);

        // 6. Overwrite the file synchronously
        writeFileSync(dataFilePath, fileContent, 'utf-8');

        // 7. Return response tracking confirmation
        return res
            .status(201)
            .json({ success: true, data: people })
    } catch (error) {
        console.error('File write failed:', error);
        return res.status(500).json({ success: false, msg: 'Failed to write data to file' });
    }

})

app.delete('/api/people/:id', (req: Request, res: Response) => {

    const { id } = req.params
    const person = people.find((person) => person.id === Number(id))

    if (!person) {
        return res
            .status(404)
            .json({ success: false, msg: `No person found with id ${id}` })
    }

    const updatedPeople = people.filter((person) => person.id !== Number(id))
       // 🌟 FIX: Modify the array elements in-place instead of overwriting the variable link!
    people.length = 0;             // 1. Clears out all objects currently in RAM memory
    people.push(...updatedPeople); // 2. Spreads and inserts the filtered users back into it

    try {

        // 2. Read the entire raw code text from your physical file layout
        let fileContent = readFileSync(dataFilePath, 'utf-8');

        // 3. Create a clean replacement text block string for the people section
        const objectLines = updatedPeople.map(person => {
            return `  { id: ${person.id}, name: '${person.name}' }`;
        });

        // 4. Assemble the array block text perfectly matching John's structure
        const newPeopleSection = `const people = [\n${objectLines.join(',\n')}\n]`;


        // 5. Swap the old array layout block with the new custom code text block
        fileContent = fileContent.replace(/const people = \[\s*[\s\S]*?\s*\]/g, newPeopleSection);

        // 6. Overwrite the file synchronously
        writeFileSync(dataFilePath, fileContent, 'utf-8');

        // 7. Return response tracking confirmation
        return res
            .status(201)
            .json({ success: true, data: updatedPeople })

    } catch (error) {
        console.error('File write failed:', error);
        return res.status(500).json({ success: false, msg: 'Failed to write data to file' });
    }
})

app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}/`);
})