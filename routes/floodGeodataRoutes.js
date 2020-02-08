const express = require('express');
const floodGeodataController = require('../controller/floodGeodataController');
const authController = require('../controller/authController');

const router = express.Router();

router
  .route('/')
  .get(floodGeodataController.getAllFloodGeodata)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'manage-geodata'),
    floodGeodataController.createFloodGeodata
  );

router
  .route('/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'manage-geodata'),
    floodGeodataController.updateFloodGeodata
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'manage-geodata'),
    floodGeodataController.deleteFloodGeodata
  );

router
  .route('/floodProne/coordinate/:coordinate')
  .get(floodGeodataController.checkFloodPronePossibily);

router
  .route('/floodPronePlusHistory/coordinate/:coordinate')
  .get(
    authController.protect,
    floodGeodataController.checkFloodPronePossibilyPlusHistory
  );

module.exports = router;
