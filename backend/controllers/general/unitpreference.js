const Unitpreference = require("../../models/general/unitpreference");
const mongoose = require('mongoose');

let readtipul = [
  {
    $lookup: {
      from: "candidates",
      localField: "candidates",
      foreignField: "_id",
      as: "candidates"
    }
  },
  // {
  //   $lookup: {
  //     from: "users",
  //     localField: "candidates.user",
  //     foreignField: "_id",
  //     as: "candidates.users"
  //   }
  // },
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
  {
    $lookup: {
      from: "jobs",
      localField: "job",
      foreignField: "_id",
      as: "job"
    }
  },
  {
    $unwind: "$job"
  },
  {
    $lookup: {
      from: "jobtypes",
      localField: "job.jobtype",
      foreignField: "_id",
      as: "job.jobtype"
    }
  },
  {
    $unwind: "$job.jobtype"
  },
  {
    $lookup: {
      from: "units",
      localField: "job.unit",
      foreignField: "_id",
      as: "job.unit"
    }
  },
  {
    $unwind: "$job.unit"
  },
];

exports.findById = async(req, res) => {
  const unitpreference = await Unitpreference.findOne().where({_id:req.params.id})
  
  if(!unitpreference){
      res.status(500).json({success: false})
  }
  res.send(unitpreference)
  
 }

exports.find = (req, res) => {
    Unitpreference.find()
    .then((unitpreference) => res.json(unitpreference))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const unitpreference = new Unitpreference(req.body);
  unitpreference.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
    Unitpreference.findByIdAndUpdate(req.params.unitpreferenceId,req.body)
    .then((unitpreference) => res.json(unitpreference))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.remove = (req, res) => {
    Unitpreference.deleteOne({ _id: req.params.id })
    .then((unitpreference) => res.json(unitpreference))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.unitpreferencebyjobid = (req, res) => {
  let tipulfindquerry = readtipul.slice();
  let finalquerry = tipulfindquerry;

  let andquery = [];

  //jobid
  if (req.params.jobid != 'undefined') {
    andquery.push({ "job._id": mongoose.Types.ObjectId(req.params.jobid) });
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

  Unitpreference.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
};