const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const jobinmahzorSchema = new mongoose.Schema({
    mahzor:{type:ObjectId,ref:'Mahzor'},
    job:{type:ObjectId,ref:'Job'},
    // unit:{type:ObjectId,ref:'Unit'},
    // mahlaka:{type:String},
    // thom:{type:String},
    // location:{type:String},
    // peilut:{type:String},
    // damah:{type:Boolean},
    // sivug:{type:String},
    // certain:{type:Boolean},
    // migzar:{type:String},
    // description:{type:String}
});

const Jobinmahzor = mongoose.model('Jobinmahzor', jobinmahzorSchema);

module.exports = Jobinmahzor;

