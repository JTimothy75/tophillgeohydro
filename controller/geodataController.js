// const debug = require('debug')('server:fileController');
// const chalk = require('chalk');
const Geodata = require('../model/geodataModel');
const APIFeatures = require('./../utilities/apiFeatures');
const catchAsync = require('./../utilities/catchAsync');
const AppError = require('./../utilities/appError');

exports.getAllGeodata = catchAsync(async (req, res, next) => {
  // Execute query
  const features = new APIFeatures(Geodata.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const geodatas = await features.query;

  // Todo   🏆🏆🏆🏆🏆🏆🏆🏆🏆🏆🏆 remove geodata.features.[1].history
  geodatas.features.forEach(el => {
    el.history = undefined;
  });

  res.status(200).json({
    status: 'success',
    results: geodatas.length,
    data: {
      geodatas
    }
  });
});

exports.getGeodataByLayer = catchAsync(async (req, res, next) => {
  const geodata = await Geodata.findOne({ layer: req.params.layer });

  if (!geodata) {
    return next(new AppError('No file found with that id', 404));
  }

  // Todo   🏆🏆🏆🏆🏆🏆🏆🏆🏆🏆🏆 remove geodata.features.[].history
  // geodata.features.history = undefined;
  geodata.features.forEach(el => {
    el.lgaName = undefined;
    el.history = undefined;
    // el.area_name = undefined;
    el.objectid = undefined;
    el.area = undefined;
    el.district = undefined;
  });

  res.status(200).json({
    status: 'success',
    data: {
      geodata
    }
  });
});

exports.createGeoLayer = catchAsync(async (req, res, next) => {
  const newGeodata = await Geodata.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: newGeodata
    }
  });
});

exports.updateGeoLayer = catchAsync(async (req, res, next) => {
  const updateToGeodata = await Geodata.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!updateToGeodata) {
    return next(new AppError('No file found with that id', 404));
  }

  res.status(201).json({
    status: 'success',
    data: {
      data: updateToGeodata
    }
  });
});

exports.deleteGeoLayer = catchAsync(async (req, res, next) => {
  const geodata = await Geodata.findByIdAndDelete(req.params.id);

  if (!geodata) {
    return next(new AppError('No file found with that id', 404));
  }

  res.status(204).json({
    status: 'success',
    message: null
  });
});
