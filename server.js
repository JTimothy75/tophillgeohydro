const mongoose = require('mongoose');
// const debug = require('debug')('server');
const chalk = require('chalk');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥💥 Shutting down....');
  console.log(err.name, err.message, err);
  process.exit(1);
});

dotenv.config({
  path: './config.env'
});
const app = require('./app');

const dbUrl = process.env.DATABASE;

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log(`DB connection ${chalk.green('successful')}`));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening on port ${chalk.green(port)}`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLE REJECTION! 💥💥 Shutting down....');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
