'use strict';

let db = require('sqlite');

var utils = require('./../helpers/utils.js');

const dbPromise = Promise.resolve()
	.then(() => db.open('./database.db', { Promise }));

var Region = function() {};

function getRegionID_recursive(longitude, latitude, callback, rootRegionID)
{
  let currentRegionID = 0;
  let currentRegionDistance = -1.0;

  dbPromise.then((db) => {
    db.all(`SELECT * FROM Region WHERE Region.parentRegionId='${rootRegionID}'`).then(regions => {
      //if there are no rows we are at the bottom so return
      if(regions == undefined || regions.length === 0)
      {
        callback(rootRegionID);
        return;
      }

      regions.forEach((region) => {

        let distance = Region.distanceLongLat(longitude, latitude, region.longitude, region.latitude) - region.radius;

        if(currentRegionDistance == -1.0 || distance < currentRegionDistance)
        {
          currentRegionID = region.id;
          currentRegionDistance = distance;
        }
      });

      getRegionID_recursive(longitude, latitude, callback, currentRegionID);
    });
  });
}

// returns the region ID for a point
Region.getRegionID = function(longitude, latitude, callback)
  {
    getRegionID_recursive(longitude, latitude, callback, 0);
  };

Region.distanceLongLat = function(longitude1, latitude1, longitude2, latitude2)
  {
    const EarthRadius = 6371000.0;

    let r_longitude1 = utils.toRadians(longitude1);
    let r_latitude1  = utils.toRadians(latitude1);
    let r_longitude2 = utils.toRadians(longitude2);
    let r_latitude2  = utils.toRadians(latitude2);

    return EarthRadius * Math.acos(
  		Math.sin(r_latitude1) * Math.sin(r_latitude2) +
  		(Math.cos(r_latitude1) * Math.cos(r_latitude2) * Math.cos(r_longitude2 - r_longitude1)));
  };

module.exports = Region;
