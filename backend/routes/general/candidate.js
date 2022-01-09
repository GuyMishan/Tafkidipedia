const express = require('express');
const router = express.Router()

const { create, find, update, remove, findById,candidatesbymahzorid,candidatesbyuser,smartcandidatebyid} = require('../../controllers/general/candidate');

// find spec 
router.get('/candidate/:id', findById)
//find all
router.get('/candidate', find)
//add 
router.post('/candidate',create); /**/ 
//update 
router.put('/candidate/:candidateId', update)
//delete 
router.delete('/candidate/:id', remove )

router.get('/candidatesbymahzorid/:mahzorid',candidatesbymahzorid); /**/ 

router.get('/candidate/candidatesbyuser/:userid',candidatesbyuser); /**/ 

router.get('/candidate/smartcandidatebyid/:candidateid',smartcandidatebyid); /**/ 

module.exports = router;