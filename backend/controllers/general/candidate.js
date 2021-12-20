const Candidate = require("../../models/general/candidate");
const mongoose = require('mongoose');

let readtipul = [
  {
    $lookup: {
      from: "users",
      localField: "user",
      foreignField: "_id",
      as: "user"
    }
  },
  {
    $unwind: "$user"
  },
  {
    $lookup: {
      from: "mahzors",
      localField: "mahzor",
      foreignField: "_id",
      as: "mahzor"
    }
  },
  {
    $unwind: "$mahzor"
  },
];

exports.findById = async (req, res) => {
  const candidate = await Candidate.findOne().where({ _id: req.params.id })

  if (!candidate) {
    res.status(500).json({ success: false })
  }
  res.send(candidate)

}

exports.find = (req, res) => {
  Candidate.find()
    .then((candidate) => res.json(candidate))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const candidate = new Candidate(req.body);
  candidate.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
  const candidate = new Candidate(req.body);
  Candidate.updateOne(candidate)
    .then((candidate) => res.json(candidate))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.remove = (req, res) => {
  Candidate.deleteOne({ _id: req.params.id })
    .then((candidate) => res.json(candidate))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.candidatesbymahzorid = async (req, res) => {
  let tipulfindquerry = readtipul.slice();
  let finalquerry = tipulfindquerry;

  let andquery = [];

  //mahzorid
  if (req.params.mahzorid != 'undefined') {
    andquery.push({ "mahzor._id": mongoose.Types.ObjectId(req.params.mahzorid) });
  }

  if (andquery.length != 0) {
    let matchquerry = {
      "$match": {
        "$and": andquery
      }
    };
    finalquerry.push(matchquerry)
  }

  // console.log(matchquerry)
  //console.log(andquery)

  Candidate.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
}