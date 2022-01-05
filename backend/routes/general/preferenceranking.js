const express = require('express');
const router = express.Router()

const { create, find, update, remove, findById} = require('../../controllers/general/preferenceranking');

// find spec 
router.get('/preferenceranking/:id', findById)
//find all
router.get('/preferenceranking', find)
//add 
router.post('/preferenceranking',create); /**/ 
//update 
router.put('/preferenceranking/:preferencerankingId', update)
//delete 
router.delete('/preferenceranking/:id', remove )

module.exports = router;