const express = require('express');
const router = express.Router()

const { create, find, update, remove, findById} = require('../../controllers/general/mahzoriosh');

// find spec 
router.get('/mahzoriosh/:id', findById)
//find all
router.get('/mahzoriosh', find)
//add 
router.post('/mahzoriosh',create); /**/ 
//update 
router.put('/mahzoriosh/:mahzorioshId', update)
//delete 
router.delete('/mahzoriosh/:id', remove )

module.exports = router;