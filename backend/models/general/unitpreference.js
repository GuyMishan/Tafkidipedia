const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const unitpreferenceSchema = new mongoose.Schema({
    mahzor:{type:ObjectId , ref:'Mahzor'},
    jobinmahzor:{type:ObjectId,ref:'Jobinmahzor'},
    preferencerankings:[{type:ObjectId,ref:'Preferenceranking'}],
});

const Unitpreference = mongoose.model('Unitpreference', unitpreferenceSchema);

module.exports = Unitpreference;

