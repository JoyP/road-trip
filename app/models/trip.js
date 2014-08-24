'use strict';

var Mongo = require('mongodb'),
    fs    = require('fs'),
    path  = require('path'),
    _     = require('lodash');

function Trip(o){
  this._id          = Mongo.ObjectID();
  this.tripName     = o.tripName[0];
  this.cash         = parseFloat(o.cash[0]);
  this.origin       = {name:o.originName[0], lat:parseFloat(o.beginLat[0]), lng:parseFloat(o.beginLng[0])};
  this.destination  = {name:o.destinationName[0], lat:parseFloat(o.endLat[0]), lng:parseFloat(o.endLng[0])};
  this.startDate    = new Date(o.startDate[0]);
  this.endDate      = new Date(o.endDate[0]);
  this.mpg          = parseFloat(o.mpg[0]);
  this.gasPrice     = parseFloat(o.gasPrice[0]);
  this.carPhoto     = '';
  this.stops        = [];
  this.photos       = [];
}

Object.defineProperty(Trip, 'collection', {
  get: function(){return global.mongodb.collection('trips');}
});

Trip.create = function(fields, file, cb){
  var t = new Trip(fields);
  console.log('t in create function, after create:', t);
  t.saveCarPic(file);
  Trip.collection.save(t,cb);
};

Trip.all = function(cb){
  Trip.collection.find().toArray(cb);
};

Trip.findById = function(id,cb){
  var _id = Mongo.ObjectID(id);
  Trip.collection.findOne({_id:_id}, function(err,obj){
    cb(err, _.create(Trip.prototype,obj));
  });
};

Trip.prototype.saveCarPic = function(file){
  var baseDir   = __dirname + '/../static',
      relDir    = '/img/' + this._id,
      absDir    = baseDir + relDir,
      ext       = path.extname(file.carPhoto[0].path),
      absPath   = absDir + '/' + 'car' + ext,
      relPath   = relDir + '/' + 'car' + ext;

  if(!file.carPhoto[0].size){return;}

  fs.mkdirSync(absDir);
  fs.renameSync(file.carPhoto[0].path, absPath);
  this.carPhoto = relPath;
};

Trip.prototype.savePhotos = function(files, cb){
  var baseDir   = __dirname + '/../static',
      relDir    = '/img/' + this._id,
      absDir    = baseDir + relDir;

  fs.mkdirSync(absDir);

  this.photos = files.photos.map(function(photo, index){
    if(!photo.size){return;}

    var ext     = path.extname(photo.path),
        name    = index + ext,
        absPath = absDir + '/' + name,
        relPath = relDir + '/' + name;

    fs.renameSync(photo.path, absPath);
    return relPath;
  });

  this.photos = _.compact(this.photos);
};

module.exports = Trip;

