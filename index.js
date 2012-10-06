
module.exports = process.env.EXPRESS_COV
  ? require('./lib-cov/deviceTracker')
  : require('./lib/deviceTracker');
