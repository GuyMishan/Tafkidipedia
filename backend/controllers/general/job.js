const Job = require("../../models/general/job");
const mongoose = require('mongoose');

let readtipul = [
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
  {
    $lookup: {
      from: "users",
      localField: "meaish",
      foreignField: "_id",
      as: "meaish"
    }
  },
  {
    $unwind: "$meaish"
  },
  {
    $lookup: {
      from: "users",
      localField: "commander",
      foreignField: "_id",
      as: "commander"
    }
  },
  {
    $unwind: "$commander"
  },
];

let readtipul2 = [
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
  let tipulfindquerry = readtipul2.slice();
  let finalquerry = tipulfindquerry;

  let andquery = [];

  //id
  if (req.params.id != 'undefined') {
    andquery.push({ "_id": mongoose.Types.ObjectId(req.params.id) });
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

 exports.smartjobbyid = async(req, res) => {
  let tipulfindquerry = readtipul.slice();
  let finalquerry = tipulfindquerry;

  let andquery = [];

  //id
  if (req.params.id != 'undefined') {
    andquery.push({ "_id": mongoose.Types.ObjectId(req.params.id) });
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

exports.find = (req, res) => {
    Job.find()
    .then((job) => res.json(job))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const job = new Job(req.body);
  job.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
  Job.findByIdAndUpdate(req.params.jobId,req.body)
    .then((job) => res.json(job))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.remove = (req, res) => {
    Job.deleteOne({ _id: req.params.id })
    .then((job) => res.json(job))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.smartjobs = async(req, res) => {
  let tipulfindquerry = readtipul.slice();
  let finalquerry = tipulfindquerry;

  Job.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
 }

exports.jobsbymahzorid = async(req, res) => {
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