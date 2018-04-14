'use strict';

/** 
 * Negative testing to prove swagger validations.
 */
const limberest = require('limberest');
const demo = require('../lib/limberest-demo');
const Case = limberest.Case;

var options = demo.getOptions();
const testCase = new Case('movie-validations', options);
testCase.authHeader = demo.getAuthHeader();
const values = {'base-url': 'https://limberest.io/demo', id: '435b30ad'};
const logger = demo.getLogger('movies-api', testCase.name);

var group = 'movies-api.postman';

limberest.loadGroup(options.location + '/' + group)
.then(loadedGroup => {
  group = loadedGroup;
  // start clean
  return demo.cleanupMovie(group, values);
})
.then(response => {
  var post = group.getRequest('POST', 'movies');
  var movie = post.json();
  delete movie.title; // no title
  movie.year = 1812;  // invalid year
  post.json(movie);
  return testCase.run(post, values, 'bad post');  
})
.then(response => {
  // create good movie
  var post = group.getRequest('POST', 'movies');
  return testCase.run(post, values, 'create movie');
})
.then(response => {
  // rating is parameterized, so set through values
  values.rating = 5.2; // bad on two counts
  var put = group.getRequest('PUT', 'movies/{id}');
  return testCase.run(put, values);
})
.then(response => {
  // confirm it didn't take
  var get = group.getRequest('GET', 'movies/{id}');
  return testCase.run(get, values);
})
.then(response => {
  // clean up
  var del = group.getRequest('DELETE', 'movies/{id}');
  return testCase.run(del, values);
})
.then(response => {
  // load results
  return limberest.loadFile(options, 'results/expected/movies-api/movie-validations.yaml');
})
.then(expectedResult => {
  // compare expected vs actual
  var res = testCase.verifyResult(expectedResult, values);
  if (demo.getUiCallback()) {
    // tell the UI (limberest-ui)
    demo.getUiCallback()(null, res, values);
  }
})
.catch(err => {
  logger.error(err);
  if (demo.getUiCallback()) {
    demo.getUiCallback()(err);
  }
});

