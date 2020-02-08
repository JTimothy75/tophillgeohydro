const mongoose = require('mongoose');
const slugify = require('slugify');
// const debug = require('debug')('server:fileController');

const floodGeodatasSchema = new mongoose.Schema({
  proneArea: {
    area: Number,
    lgaName: String,
    proneOrNot: {
      type: String,
      default: 'This area is flood prone'
    },
    history: String,
    type: {
      type: String,
      default: 'MultiPolygon'
    },
    coordinates: [[[Number]]]
  }

  //TODO
});

// floodGeodatasSchema.index({ proneArea: '2dsphere' });

const FloodGeodatas = mongoose.model('FloodGeodatas', floodGeodatasSchema);

module.exports = FloodGeodatas;
