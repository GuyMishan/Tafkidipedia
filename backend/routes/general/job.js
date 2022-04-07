const express = require('express');
const router = express.Router()

const { create, find, update, remove, findById,smartjobbyid,smartjobs,jobsbymahzorid,smartjobs2} = require('../../controllers/general/job');

// find spec 
router.get('/job/:id', findById)

router.get('/smartjobbyid/:id', smartjobbyid)
//find all
router.get('/job', find)
//add 
router.post('/job',create); /**/ 
//update 
router.put('/job/:jobId', update)
//delete 
router.delete('/job/:id', remove )

router.get('/smartjobs',smartjobs); 

router.get('/jobsbymahzorid/:mahzorid',jobsbymahzorid); 

router.get('/smartjobs2',smartjobs2); 

module.exports = router;