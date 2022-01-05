const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const preferencerankingSchema = new mongoose.Schema({
    candidate:{type:ObjectId,ref:'Candidate'},
    rank:{type:Number},
});

const Preferenceranking = mongoose.model('Preferenceranking', preferencerankingSchema);

module.exports = Preferenceranking;

