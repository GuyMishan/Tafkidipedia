const express = require('express');
const router = express.Router()

const { create, find, update, remove, findById,deleteMahzorFinalEshkol,finaleshkolbymahzorid,finaleshkolbymahzoridandunitid,finaleshkolbyjobid} = require('../../controllers/general/finaleshkol');

// find spec 
router.get('/finaleshkol/:id', findById)
//find all
router.get('/finaleshkol', find)
//add 
router.post('/finaleshkol',create); /**/ 
//update 
router.put('/finaleshkol/:finaleshkolId', update)
//delete 
router.delete('/finaleshkol/:id', remove )

router.delete('/finaleshkol/deletemahzorfinaleshkol/:mahzorid', deleteMahzorFinalEshkol )

router.get('/finaleshkolbymahzorid/:mahzorid', finaleshkolbymahzorid)

router.get('/finaleshkolbymahzoridandunitid/:mahzorid/:unitid', finaleshkolbymahzoridandunitid)

router.get('/finaleshkolbyjobid/:jobid', finaleshkolbyjobid)

module.exports = router;