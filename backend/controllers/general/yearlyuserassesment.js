const Yearlyuserassesment = require("../../models/general/yearlyuserassesment");

exports.findById = async(req, res) => {
  const yearlyuserassesment = await Yearlyuserassesment.findOne().where({_id:req.params.id})
  
  if(!yearlyuserassesment){
      res.status(500).json({success: false})
  }
  res.send(yearlyuserassesment)
  
 }

exports.find = (req, res) => {
    Yearlyuserassesment.find()
    .then((yearlyuserassesment) => res.json(yearlyuserassesment))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const yearlyuserassesment = new Yearlyuserassesment(req.body);
  yearlyuserassesment.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
  Yearlyuserassesment.findByIdAndUpdate(req.params.yearlyuserassesmentId,req.body)
    .then((yearlyuserassesment) => res.json(yearlyuserassesment))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.remove = (req, res) => {
    Yearlyuserassesment.deleteOne({ _id: req.params.id })
    .then((yearlyuserassesment) => res.json(yearlyuserassesment))
    .catch((err) => res.status(400).json("Error: " + err));
};