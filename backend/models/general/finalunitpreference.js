const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const finalunitpreferenceSchema = new mongoose.Schema({
    mahzor:{type:ObjectId , ref:'Mahzor'},
    job:{type:ObjectId,ref:'Job'},
    preferencerankings:[{type:ObjectId,ref:'Preferenceranking'}],
});

const FinalUnitpreference = mongoose.model('FinalUnitpreference', finalunitpreferenceSchema);

module.exports = FinalUnitpreference;

