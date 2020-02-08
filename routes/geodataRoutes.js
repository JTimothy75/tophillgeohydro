const express = require('express');
const geodataController = require('./../controller/geodataController');
const authController = require('../controller/authController');

const router = express.Router();

router
  .route('/')
  .get(geodataController.getAllGeodata)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'manage-geodata'),
    geodataController.createGeoLayer
  );

router.route('/:layer').get(geodataController.getGeodataByLayer);

router
  .route('/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'manage-geodata'),
    geodataController.updateGeoLayer
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'manage-geodata'),
    geodataController.deleteGeoLayer
  );

module.exports = router;
