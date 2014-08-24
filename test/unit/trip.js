/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Trip      = require('../../app/models/trip'),
    dbConnect = require('../../app/lib/mongodb'),
    Mongo     = require('mongodb'),
    cp        = require('child_process'),
    db        = 'testTrips';

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
    it('should create a new Trip object', function(done){
      var trip  = {
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
          file  = {carPhoto:
                    [{fieldName:'carPhoto',
                    originalFilename: 'car.jpg'}]
          };

      Trip.create(trip, file, function(){
        expect(trip).to.be.instanceof(Trip);
        expect(trip._id).to.be.instanceof(Mongo.ObjectID);
        expect(trip.tripName).to.equal('Las Vegas');
        expect(trip.cash).to.equal(1000);
        expect(trip.origin.name).to.equal('Nashville, TN, USA');
        expect(trip.destination.name).to.equal('Las Vegas, NV, USA');

        expect(trip.mpg).to.equal(35);
        expect(trip.gasPrice).to.equal(3.40);


        expect(trip.stops).to.have.length(0);
        expect(trip.photos).to.have.length(0);
        done();
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

});

