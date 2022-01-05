const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const mahzorioshSchema = new mongoose.Schema({
    name:{type:String},//רסן הנדסי/נגדים..
});

const Mahzoriosh = mongoose.model('Mahzoriosh', mahzorioshSchema);

module.exports = Mahzoriosh;

