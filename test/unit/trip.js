/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Trip      = require('../../app/models/trip'),
    dbConnect = require('../../app/lib/mongodb'),
    Mongo     = require('mongodb'),
    cp        = require('child_process'),
    db        = 'testTrips',
    fields    = {
      beginLat:['36.1667'],
      beginLng:['-86.7833'],
      endLat:['36.1699'],
      endLng:['-115.1398'],
      tripName:['Las Vegas'],
      cash:['1000'],
      originName:['Nashville, TN, USA'],
      destinationName:['Las Vegas, NV, USA'],
      startDate:['2014-08-25'],
      endDate:['2014-08-30'],
      mpg:['35'],
      gasPrice:['3.40']
    },
    t;

describe('Trip', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      console.log('clean db log:', stdout, stderr);
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new Trip object', function(){
      t  = new Trip(fields);

      expect(t._id).to.be.instanceof(Mongo.ObjectID);
      expect(t.tripName).to.equal('Las Vegas');
      expect(t.cash).to.equal(1000);
      expect(t.origin.name).to.equal('Nashville, TN, USA');
      expect(t.destination.name).to.equal('Las Vegas, NV, USA');

      expect(t.mpg).to.equal(35);
      expect(t.gasPrice).to.equal(3.40);


      expect(t.stops).to.have.length(0);
      expect(t.photos).to.have.length(0);
    });

    it('should save a new object to the database', function(){

      t = Trip.create(fields, {carPhoto: [{path:''}]}, function(){
        expect(t._id).to.be.instanceof(Mongo.ObjectID);
        Trip.findById(t._id, function(err, found){
          expect(found).to.be.instanceof(Trip);
          expect(found.carPhoto).to.equal('');
        });
      });
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

  describe('.findById', function(){
    it('should find an item by its ID', function(done){
      t = Trip.create(fields, {carPhoto: [{path:''}]}, function(){
        Trip.findById(t._id, function(err, foundTrip){
          expect(foundTrip).to.be.instanceof(Trip);
          expect(foundTrip.tripName).to.equal('Las Vegas');
          done();
        });
      });
    });
  });

});

