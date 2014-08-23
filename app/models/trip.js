'use strict';

var Mongo = require('mongodb'),
    fs    = require('fs'),
    path  = require('path'),
    _     = require('lodash');

function Trip(o){
  this._id          = Mongo.ObjectID();
  this.beginLat     = parseFloat(o.beginLat[0]);
  this.beginLng     = parseFloat(o.beginLng[0]);
  this.endLat       = parseFloat(o.endLat[0]);
  this.endLng       = parseFloat(o.endLng[0]);
  this.tripName     = o.tripName[0];
  this.cash         = parseFloat(o.cash[0]);
  this.origin       = o.origin[0];
  this.destination  = o.destination[0];
  this.startDate    = new Date(o.startDate[0]);
  this.endDate      = new Date(o.endDate[0]);
  this.mpg          = parseFloat(o.mpg[0]);
  this.carPhoto     = '';
  this.photos       = [];
}

Object.defineProperty(Trip, 'collection', {
  get: function(){return global.mongodb.collection('trips');}
});

Trip.create = function(fields, file, cb){
  var t = new Trip(fields);
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
      ext       = path.extname(file.photo[0].path),
      absPath   = absDir + '/' + 'car' + ext,
      relPath   = relDir + '/' + 'car' + ext;

  if(!file.photo[0].size){return;}

  fs.mkdirSync(absDir);
  fs.renameSync(file.photo[0].path, absPath);
  return relPath;
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

