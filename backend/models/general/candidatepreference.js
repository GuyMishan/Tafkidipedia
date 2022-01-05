const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const candidatepreferenceSchema = new mongoose.Schema({
    mahzor:{type:ObjectId,ref:'Mahzor'},
    candidate:{type:ObjectId,ref:'Candidate'},
    certjobpreferences:[{type:ObjectId,ref:'Job'}],
    noncertjobpreferences:[{type:ObjectId,ref:'Job'}],
});

const Candidatepreference = mongoose.model('Candidatepreference', candidatepreferenceSchema);

module.exports = Candidatepreference;

