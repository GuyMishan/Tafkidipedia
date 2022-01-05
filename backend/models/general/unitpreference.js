const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const unitpreferenceSchema = new mongoose.Schema({
    mahzor:{type:ObjectId , ref:'Mahzor'},
    job:{type:ObjectId,ref:'Job'},
    preferencerankings:[{type:ObjectId,ref:'Preferenceranking'}],
});

const Unitpreference = mongoose.model('Unitpreference', unitpreferenceSchema);

module.exports = Unitpreference;

