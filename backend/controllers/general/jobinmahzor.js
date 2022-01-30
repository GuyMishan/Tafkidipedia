const Job = require("../../models/general/jobinmahzor");
const mongoose = require('mongoose');

let readtipul = [
  {
    $lookup: {
      from: "jobtypes",
      localField: "jobtype",
      foreignField: "_id",
      as: "jobtype"
    }
  },
  {
    $unwind: "$jobtype"
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
  {
    $lookup: {
      from: "units",
      localField: "unit",
      foreignField: "_id",
      as: "unit"
    }
  },
  {
    $unwind: "$unit"
  },
];

exports.findById = async(req, res) => {
  const jobinmahzor = await Job.findOne().where({_id:req.params.id})
  
  if(!jobinmahzor){
      res.status(500).json({success: false})
  }
  res.send(jobinmahzor)
  
 }

exports.find = (req, res) => {
    Job.find()
    .then((jobinmahzor) => res.json(jobinmahzor))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const jobinmahzor = new Job(req.body);
  jobinmahzor.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
  const jobinmahzor = new Job(req.body);
  Job.updateOne(jobinmahzor)
    .then((jobinmahzor) => res.json(jobinmahzor))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.remove = (req, res) => {
    Job.deleteOne({ _id: req.params.id })
    .then((jobinmahzor) => res.json(jobinmahzor))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.jobinmahzorbyid = async(req, res) => {
  let tipulfindquerry = readtipul.slice();
  let finalquerry = tipulfindquerry;

  let andquery = [];

  //jobinmahzorid
  if (req.params.jobinmahzorid != 'undefined') {
    andquery.push({ "_id": mongoose.Types.ObjectId(req.params.jobinmahzorid) });
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

  Job.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
 }

exports.jobinmahzorsbymahzorid = async(req, res) => {
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

  Job.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
 }

 exports.jobinmahzorsbymahzoridandunitid = async(req, res) => {
  let tipulfindquerry = readtipul.slice();
  let finalquerry = tipulfindquerry;

  let andquery = [];

  //mahzorid
  if (req.params.mahzorid != 'undefined') {
    andquery.push({ "mahzor._id": mongoose.Types.ObjectId(req.params.mahzorid) });
  }

  if (req.params.unitid != 'undefined') {
    andquery.push({ "unit._id": mongoose.Types.ObjectId(req.params.unitid) });
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

  Job.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
 }