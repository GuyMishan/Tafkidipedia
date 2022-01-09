const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const candidatepreferenceranking = new mongoose.Schema({
    job:{type:ObjectId,ref:'Job'},
    rank:{type:Number},
});

const Candidatepreferenceranking = mongoose.model('Candidatepreferenceranking', candidatepreferenceranking);

module.exports = Candidatepreferenceranking;

