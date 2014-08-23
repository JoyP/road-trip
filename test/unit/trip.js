/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Trip      = require('../../app/models/trip'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    db        = 'trips';

describe('Trip', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new Trip object', function(){
      var t = {
                '_id':{'$oid':'000000000000000000000004'},
                'beginLat':36.1667,
                'beginLng':-86.7833,
                'endLat':36.1699,
                'endLng':-115.1398,
                'tripName':'Las Vegas',
                'cash':1000,
                'origin':'Nashville, TN, USA',
                'destination':'Las Vegas, NV, USA',
                'startDate':'2014-08-25',
                'endDate':'2014-08-30',
                'mpg':35
              };

      Trip.create(t);
      expect(t).to.be.instanceof(Trip);
    });
  });

  describe('.all', function(){
    it('should get all trips', function(done){
      Trip.all(function(err, trips){
        expect(trips).to.have.length(3);
        done();
      });
    });
  });
});

