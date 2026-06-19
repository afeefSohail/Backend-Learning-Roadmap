import express from 'express'
const router = express.Router()

import {
    getPeople,
    getPerson,
    createPersonPostman,
    updatePerson,
    deletePerson
} from '#controllers/people.js';

// Base Path => /api/people for router

// router.get('/', getPeople)
// router.get('/:id', getPerson)
// router.post('/postman', createPersonPostman)
// router.put('/:id', updatePerson)
// router.delete('/:id', deletePerson)

router.route('/').get(getPeople)
router.route('/:id').get(getPerson).put(updatePerson).delete(deletePerson)
router.route('/postman').post(createPersonPostman)


export default router