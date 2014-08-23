'use strict';

var Trip  = require('../models/trip'),
    mp    = require('multiparty');

exports.index = function(req, res){
  res.render('trips/index');
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
