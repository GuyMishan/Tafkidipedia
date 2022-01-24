const express = require('express');
const router = express.Router()

const { create, find, update, remove, findById} = require('../../controllers/general/yearlyuserassesment');

// find spec 
router.get('/yearlyuserassesment/:id', findById)
//find all
router.get('/yearlyuserassesment', find)
//add 
router.post('/yearlyuserassesment',create); /**/ 
//update 
router.put('/yearlyuserassesment/:yearlyuserassesmentId', update)
//delete 
router.delete('/yearlyuserassesment/:id', remove )

module.exports = router;