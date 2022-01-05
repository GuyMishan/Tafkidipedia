const Preferenceranking = require("../../models/general/preferenceranking");

exports.findById = async(req, res) => {
  const preferenceranking = await Preferenceranking.findOne().where({_id:req.params.id})
  
  if(!preferenceranking){
      res.status(500).json({success: false})
  }
  res.send(preferenceranking)
  
 }

exports.find = (req, res) => {
    Preferenceranking.find()
    .then((preferenceranking) => res.json(preferenceranking))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const preferenceranking = new Preferenceranking(req.body);
  preferenceranking.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
  Preferenceranking.findByIdAndUpdate(req.params.preferencerankingId,req.body)
    .then((preferenceranking) => res.json(preferenceranking))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.remove = (req, res) => {
    Preferenceranking.deleteOne({ _id: req.params.id })
    .then((preferenceranking) => res.json(preferenceranking))
    .catch((err) => res.status(400).json("Error: " + err));
};