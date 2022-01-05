const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const mahzorSchema = new mongoose.Schema({
    name:{type:String},
    startdate:{type:Date},
    enddate:{type:Date},
    numberofjobpicks:{type:Number},
    status:{type:Number},
    type:{type:String},
    mahzoriosh:{type:ObjectId,ref:'Mahzoriosh'},
});

const Mahzor = mongoose.model('Mahzor', mahzorSchema);

module.exports = Mahzor;

