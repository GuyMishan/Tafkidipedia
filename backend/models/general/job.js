const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const jobSchema = new mongoose.Schema({
    mahzor:{type:ObjectId,ref:'Mahzor'},
    jobtype:{type:ObjectId,ref:'JobType'},
    unit:{type:ObjectId,ref:'Unit'},
    mahlaka:{type:String},
    thom:{type:String},
    location:{type:String},
    peilut:{type:String},
    damah:{type:Boolean},
    sivug:{type:String},
    certain:{type:Boolean},
    migzar:{type:String},
    description:{type:String}
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;

