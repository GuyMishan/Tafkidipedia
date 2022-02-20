const express = require('express');
const router = express.Router()

const { create, find, update, remove, findById,jobinmahzorsbymahzorid,jobinmahzorsbymahzoridandunitid,jobinmahzorbyid,updatejobinmahzorbyjobidandmahzorid,deletjobinmahzorbyjobidandmahzorid} = require('../../controllers/general/jobinmahzor');

// find spec 
router.get('/jobinmahzor/:id', findById)
//find all
router.get('/jobinmahzor', find)
//add 
router.post('/jobinmahzor',create); /**/ 
//update 
router.put('/jobinmahzor/:jobinmahzorId', update)
//delete 
router.delete('/jobinmahzor/:id', remove )

router.get('/jobinmahzorbyid/:jobinmahzorid',jobinmahzorbyid); 

router.get('/jobinmahzorsbymahzorid/:mahzorid',jobinmahzorsbymahzorid); 

router.get('/jobinmahzorsbymahzoridandunitid/:mahzorid/:unitid',jobinmahzorsbymahzoridandunitid); 

router.put('/updatejobinmahzorbyjobidandmahzorid/:jobid/:mahzorid', updatejobinmahzorbyjobidandmahzorid)

router.delete('/deletjobinmahzorbyjobidandmahzorid/:jobid/:mahzorid', deletjobinmahzorbyjobidandmahzorid )

module.exports = router;