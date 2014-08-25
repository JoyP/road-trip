'use strict';

var Trip    = require('../models/trip'),
    mp      = require('multiparty'),
    moment  = require('moment');

exports.index = function(req, res){
  Trip.all(function(err, trips){
    res.render('trips/index', {trips:trips, moment:moment});
  });
};

exports.new = function(req, res){
  res.render('trips/new');
};

exports.create = function(req,res){
  var form = new mp.Form();
  form.parse(req, function(err, fields, file){
    Trip.create(fields, file, function(){
      res.redirect('/trips');
    });
  });
};
