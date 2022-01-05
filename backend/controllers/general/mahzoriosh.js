const Mahzoriosh = require("../../models/general/mahzoriosh");

exports.findById = async(req, res) => {
  const mahzoriosh = await Mahzoriosh.findOne().where({_id:req.params.id})
  
  if(!mahzoriosh){
      res.status(500).json({success: false})
  }
  res.send(mahzoriosh)
  
 }

exports.find = (req, res) => {
    Mahzoriosh.find()
    .then((mahzoriosh) => res.json(mahzoriosh))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const mahzoriosh = new Mahzoriosh(req.body);
  mahzoriosh.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
  Mahzoriosh.findByIdAndUpdate(req.params.mahzorioshId,req.body)
    .then((mahzoriosh) => res.json(mahzoriosh))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.remove = (req, res) => {
    Mahzoriosh.deleteOne({ _id: req.params.id })
    .then((mahzoriosh) => res.json(mahzoriosh))
    .catch((err) => res.status(400).json("Error: " + err));
};