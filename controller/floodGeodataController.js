// const debug = require('debug')('server:fileController');
// const chalk = require('chalk');
const FloodGeodatas = require('../model/floodGeodataModel');
const APIFeatures = require('../utilities/apiFeatures');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');

exports.getAllFloodGeodata = catchAsync(async (req, res, next) => {
  // Execute query
  const features = new APIFeatures(FloodGeodatas.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const floodGeodatas = await features.query;

  // Todo   🏆🏆🏆🏆🏆🏆🏆🏆🏆🏆🏆 remove geodata.features.[1].history
  floodGeodatas.forEach(el => {
    el.proneArea.history = undefined;
  });

  res.status(200).json({
    status: 'success',
    results: floodGeodatas.length,
    data: {
      floodGeodatas
    }
  });
});

exports.createFloodGeodata = catchAsync(async (req, res, next) => {
  const newFloodGeodatas = await FloodGeodatas.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: newFloodGeodatas
    }
  });
});

exports.updateFloodGeodata = catchAsync(async (req, res, next) => {
  const updateToFloodGeodatas = await FloodGeodatas.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!updateToFloodGeodatas) {
    return next(new AppError('No file found with that id', 404));
  }

  res.status(201).json({
    status: 'success',
    data: {
      data: updateToFloodGeodatas
    }
  });
});

exports.deleteFloodGeodata = catchAsync(async (req, res, next) => {
  const floodGeodatas = await FloodGeodatas.findByIdAndDelete(req.params.id);

  if (!floodGeodatas) {
    return next(new AppError('No file found with that id', 404));
  }

  res.status(204).json({
    status: 'success',
    message: null
  });
});

// .route('/floodProne/coordinate/:coordinate/unit/:unit')
exports.checkFloodPronePossibily = catchAsync(async (req, res, next) => {
  const { coordinate } = req.params;
  const [lat, lng] = coordinate.split(',');

  if (!lat || !lng) {
    return next(
      new AppError(
        'please provide latitude and longitude in the format lat,lng',
        400
      )
    );
  }

  // console.log(lat, lng);

  let floodProne = await FloodGeodatas.find({
    proneArea: {
      $geoIntersects: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        }
      }
    }
  });

  if (floodProne.length > 0) {
    floodProne.forEach(el => {
      el.proneArea.history =
        'you are not logged in, please sign in to view the flood history of this area!';

      el.proneArea.type = undefined;
      el.proneArea.coordinates = undefined;
      el.proneArea.area = undefined;
      el.__v = undefined;
    });
  } else {
    floodProne.push({
      proneArea: {
        // history:
        //   'you are not logged in, please sign in to view the flood history of this area!',
        proneOrNot: 'This area is not flood prone'
      }
    });
  }

  res.status(200).json({
    status: 'success',
    results: floodProne.length,
    data: {
      floodProne
    }
  });
});

exports.checkFloodPronePossibilyPlusHistory = catchAsync(
  async (req, res, next) => {
    const { coordinate } = req.params;
    const [lat, lng] = coordinate.split(',');

    if (!lat || !lng) {
      return next(
        new AppError(
          'please provide latitude and longitude in the format lat,lng',
          400
        )
      );
    }

    // console.log(lat, lng);

    let floodProne = await FloodGeodatas.find({
      proneArea: {
        $geoIntersects: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          }
        }
      }
    });

    if (floodProne.length > 0) {
      floodProne.forEach(el => {
        el.proneArea.type = undefined;
        el.proneArea.coordinates = undefined;
        el.proneArea.area = undefined;
        el.__v = undefined;
      });
    } else {
      floodProne.push({
        proneArea: {
          // history:
          //   'you are not logged in, please sign in to view the flood history of this area!',
          proneOrNot: 'This area is not flood prone'
        }
      });
    }

    res.status(200).json({
      status: 'success',
      results: floodProne.length,
      data: {
        floodProne
      }
    });
  }
);
