const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const chalk = require('chalk');
const FloodGeodata = require('./../model/floodGeodataModel');
const Geodata = require('./../model/geodataModel');
dotenv.config({
  path: './config.env'
});

const dbUrl = process.env.DATABASE;

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log(`DB connection ${chalk.green('successful')}`));

//   Reading file
const floodGeodatas = JSON.parse(
  fs.readFileSync('data/floodgeodata.json', 'utf-8')
);

const ward = JSON.parse(
  fs.readFileSync('data/ward.json', 'utf-8')
);

const floodProne = JSON.parse(
  fs.readFileSync('data/floodProne.json', 'utf-8')
);
const elevenLGA = JSON.parse(
  fs.readFileSync('data/elevenLGA.json', 'utf-8')
);

// Import data in db
const importData = async (data) => {
  try {
    await FloodGeodata.create(data);
    console.log('data successfully log');
  } catch (error) {
    console.log(error);
  }
};

const importDataGeo = async (data) => {
  try {
    await Geodata.create(data);
    console.log('data successfully log');
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await FloodGeodata.deleteMany();
    console.log('data successfully deleted');
  } catch (error) {
    console.log(error);
  }
};

importData(floodGeodatas);
importDataGeo(ward);
importDataGeo(floodProne);
importDataGeo(elevenLGA);

// const port = process.env.PORT || 3000;
// const server = app.listen(port, () => {
//   console.log(`Listening on port ${chalk.green(port)}`);
// });
