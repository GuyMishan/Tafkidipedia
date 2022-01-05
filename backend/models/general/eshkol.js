const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const eshkolSchema = new mongoose.Schema({
    mahzor:{type:ObjectId,ref:'Mahzor'},
    job:{type:ObjectId,ref:'Job'},
    candidatesineshkol:[{type:ObjectId,ref:'Candidateineshkol'}],
    finalconfirmation:{type:Boolean},
});

const Eshkol = mongoose.model('Eshkol', eshkolSchema);

module.exports = Eshkol;

