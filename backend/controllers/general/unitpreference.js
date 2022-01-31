const Unitpreference = require("../../models/general/unitpreference");
const mongoose = require('mongoose');

let readtipul = [
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
      from: "jobinmahzors",
      localField: "jobinmahzor",
      foreignField: "_id",
      as: "jobinmahzor"
    }
  },
  {
    $unwind: "$jobinmahzor"
  },
  {
    $lookup: {
      from: "jobs",
      localField: "jobinmahzor.job",
      foreignField: "_id",
      as: "jobinmahzor.job"
    }
  },
  {
    $unwind: "$jobinmahzor.job"
  },
  {
    $lookup: {
      from: "units",
      localField: "jobinmahzor.job.unit",
      foreignField: "_id",
      as: "jobinmahzor.job.unit"
    }
  },
  {
    $unwind: "$jobinmahzor.job.unit"
  },
  {
    $lookup: {
      from: "unitpreferencerankings",
      localField: "preferencerankings",
      foreignField: "_id",
      as: "preferencerankings"
    }
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

exports.unitpreferencebyjobinmahzorid = (req, res) => {
  let tipulfindquerry = readtipul.slice();
  let finalquerry = tipulfindquerry;

  let andquery = [];

  //jobid
  if (req.params.jobid != 'undefined') {
    andquery.push({ "jobinmahzor._id": mongoose.Types.ObjectId(req.params.jobid) });
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

exports.smartunitpreference = (req, res) => {
  let tipulfindquerry = readtipul.slice();
  let finalquerry = tipulfindquerry;

  let andquery = [];

  if (andquery.length != 0) {
    let matchquerry = {
      "$match": {
        "$and": andquery
      }
    };
    finalquerry.push(matchquerry)
  }

  // console.log(matchquerry)
  // console.log(andquery)

  Unitpreference.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
};

exports.unitpreferencebymahzorid = (req, res) => {
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

  Unitpreference.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
};