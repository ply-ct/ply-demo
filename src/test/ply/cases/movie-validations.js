'use strict';

/** 
 * Negative testing to prove swagger validations.
 */
const ply = require('ply-ct');
const demo = require('../lib/ply-demo');
const Case = ply.Case;

var options = demo.getOptions();
const testCase = new Case('movie-validations', options);
testCase.authHeader = demo.getAuthHeader();
const values = {'baseUrl': 'https://ply-ct.com/demo/api', id: '435b30ad'};
const logger = demo.getLogger('movies-api', testCase.name);

var suiteName = 'movies-api.postman';
var group;

ply.loadGroup(options.location + '/' + suiteName)
.then(loadedGroup => {
  group = loadedGroup;
  // start clean
  return demo.cleanupMovie(group, values);
})
.then(response => {
  var post = group.getRequest('POST', 'Create Movie');
  var movie = post.json();
  delete movie.title; // no title
  movie.year = 1812;  // invalid year
  post.json(movie);
  return testCase.run(post, values, 'bad post');  
})
.then(response => {
  // create good movie
  var post = group.getRequest('POST', 'Create Movie');
  return testCase.run(post, values, 'create movie');
})
.then(response => {
  // rating is parameterized, so set through values
  values.rating = 5.2; // bad on two counts
  var put = group.getRequest('PUT', 'Update Movie');
  return testCase.run(put, values);
})
.then(response => {
  // confirm it didn't take
  var get = group.getRequest('GET', 'Movie by ID');
  return testCase.run(get, values);
})
.then(response => {
  // clean up
  var del = group.getRequest('DELETE', 'Delete Movie');
  return testCase.run(del, values);
})
.then(response => {
  // load results
  return ply.loadFile(options, 'results/expected/movies-api/movie-validations.yaml');
})
.then(expectedResult => {
  // compare expected vs actual
  var res = testCase.verifyResult(expectedResult, values);
  if (demo.getUiCallback()) {
    // tell the UI (ply-ui)
    demo.getUiCallback()(null, res, values);
  }
})
.catch(err => {
  logger.error(err);
  if (demo.getUiCallback()) {
    demo.getUiCallback()(err);
  }
});

