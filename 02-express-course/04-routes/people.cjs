const express = require('express')
const path = require('path');
const router = express.Router()

const  {
    getPeople,
    getPerson,
    createPersonPostman,
    updatePerson,
    deletePerson
} = require(path.join(__dirname, '../05-controllers/people.cjs'))

// Base Path => /api/people for router

// router.get('/', getPeople)
// router.get('/:id', getPerson)
// router.post('/postman', createPersonPostman)
// router.put('/:id', updatePerson)
// router.delete('/:id', deletePerson)

router.route('/').get(getPeople)
router.route('/:id').get(getPerson).put(updatePerson).delete(deletePerson)
router.route('/postman').post(createPersonPostman)


module.exports = router