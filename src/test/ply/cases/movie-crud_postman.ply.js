'use strict';

/**
 * Programmatically run an orchestrated sequence of tests
 * using promise syntax. TODO: regex example
 */

const ply = require('ply-ct');
// const ply = require('../../../../../ply/src/ply.js');
const demo = require('../lib/ply-demo');
const Case = ply.Case;

var options = demo.getOptions();
const testCase = new Case('movie-crud', options);
testCase.authHeader = demo.getAuthHeader();

const requests = ply.loadRequests(options.location + '/requests/movies-api.postman_collection.json');
const values = {
  'baseUrl': 'https://ply-ct.com/demo/api',
  id: '435b30ad'
};
const logger = demo.getLogger('movies-api', testCase.name);

demo.cleanupMovie(requests, values)
.then(() => {
  logger.info('Cleanup completed for movie: ' + values.id);
  let post = requests['Create Movie'];
  return testCase.run(post, values, 'create movie');
})
.then(response => {
  // update it (with programmatically-set rating)
  values.rating = 4.5;
  let put = requests['Update Movie'];
  return testCase.run(put, values, 'update rating');
})
.then(response => {
  // confirm update
  let get = requests['Movie by ID'];
  return testCase.run(get, values, 'confirm update');
})
.then(response => {
  // delete it
  let del = requests['Delete Movie'];
  return testCase.run(del, values, 'delete movie');
})
.then(response => {
  // confirm delete
  let get = requests['Movie by ID'];
  return testCase.run(get, values, 'confirm delete');
})
.then(response => {
  const expected = ply.loadFile(options.location + '/results/expected/movies-api/movie-crud.yaml');
  // compare expected vs actual
  const res = testCase.verifyResult(expected, values);
})
.catch(err => {
  testCase.handleError(err);
});
