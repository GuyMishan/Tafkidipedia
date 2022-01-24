const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const yearlyuserassesmentSchema = new mongoose.Schema({
    year:{type:Number},
    sociometrygrade:{type:Number},
    derugheily:{type:String},
    readyforkidum:{type:Boolean},
    longkevepotential:{type:Number},
    jobsuccessgrade:{type:Number},
    positivelyprominent:{type:Boolean},
});

const Yearlyuserassesment = mongoose.model('Yearlyuserassesment', yearlyuserassesmentSchema);

module.exports = Yearlyuserassesment;

