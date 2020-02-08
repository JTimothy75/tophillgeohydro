const mongoose = require('mongoose');
const slugify = require('slugify');
// const debug = require('debug')('server:fileController');

const geodataSchema = new mongoose.Schema({
  layer: {
    type: String,
    required: [true, 'The layer/feature name is required'],
    unique: true
  },
  crs: {
    type: {
      type: String,
      default: 'name'
    },
    properties: {
      name: {
        type: String,
        default: 'urn:ogc:def:crs:OGC:1.3:CRS84'
      }
    }
  },

  features: [
    {
      objectid: Number,
      name: String,
      area: Number,
      lgaName: String,
      history: String,
      area_name: String,
      district: String,
      type: {
        type: String,
        default: 'MultiPolygon'
      },
      coordinates: [[[[Number]]]]
    }
  ],

  slug: String

  //TODO
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create
geodataSchema.pre('save', function(next) {
  this.slug = slugify(this.layer, { lower: true });
  next();
});

geodataSchema.post('save', function(doc, next) {
  this.slug = slugify(this.layer, { lower: true });
  next();
});

const Geodata = mongoose.model('Geodata', geodataSchema);

module.exports = Geodata;
