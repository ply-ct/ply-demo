'use strict';

/**
 * Negative testing to prove swagger validations.
 */
const ply = require('ply-ct');
// const ply = require('../../../../../ply/src/ply.js');
const demo = require('../lib/ply-demo');
const Case = ply.Case;

var options = demo.getOptions();
const testCase = new Case('movie-validations', options);
testCase.authHeader = demo.getAuthHeader();

const requests = ply.loadRequests(options.location + '/requests/movies-api.postman_collection.json');
const values = {'baseUrl': 'https://ply-ct.com/demo/api', id: '435b30ad'};
const logger = demo.getLogger('movies-api', testCase.name);

// start clean
demo.cleanupMovie(requests, values)
.then(response => {
  let post = Object.assign({}, requests['Create Movie']);
  let movie = post.json();
  delete movie.title; // no title
  movie.year = 1812;  // invalid year
  post.json(movie);
  return testCase.run(post, values, 'bad post');
})
.then(response => {
  // create good movie
  let post = requests['Create Movie'];
  return testCase.run(post, values, 'create movie');
})
.then(response => {
  // rating is parameterized, so set through values
  values.rating = 5.2; // bad on two counts
  let put = requests['Update Movie'];
  return testCase.run(put, values);
})
.then(response => {
  // confirm it didn't take
  let get = requests['Movie by ID'];
  return testCase.run(get, values);
})
.then(response => {
  // clean up
  let del = requests['Delete Movie'];
  return testCase.run(del, values);
})
.then(response => {
  const expected = ply.loadFile(options.location + '/results/expected/movies-api/movie-validations.yaml');
  // compare expected vs actual
  const res = testCase.verifyResult(expected, values);
})
.catch(err => {
  logger.error(err);
});

