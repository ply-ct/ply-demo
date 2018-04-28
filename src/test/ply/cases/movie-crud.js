'use strict';

/** 
 * Programmatically run an orchestrated sequence of tests 
 * using promise syntax. TODO: regex example
 */ 

const limberest = require('limberest');
const demo = require('../lib/limberest-demo');
const Case = limberest.Case;

var options = demo.getOptions();
const testCase = new Case('movie-crud', options);
testCase.authHeader = demo.getAuthHeader();

const values = {
  'base-url': 'https://limberest.io/demo',
  id: '435b30ad'
};
const logger = demo.getLogger('movies-api', testCase.name);

var group = 'movies-api.postman'; // to be replaced once loaded

limberest.loadGroup(options.location + '/' + group)
.then(loadedGroup => {
  group = loadedGroup;
  return demo.cleanupMovie(group, values);
})
.then(() => {
  logger.info('Cleanup completed for movie: ' + values.id);
  var post = group.getRequest('POST', 'movies');
  return testCase.run(post, values, 'create movie');
})
.then(response => {
  // update it (with programmatically-set rating)
  values.rating = 4.5;
  var put = group.getRequest('PUT', 'movies/{id}');
  return testCase.run(put, values, 'update rating');
})
.then(response => {
  // confirm update
  var get = group.getRequest('GET', 'movies/{id}');
  return testCase.run(get, values, 'confirm update');
})
.then(response => {
  // delete it
  var del = group.getRequest('DELETE', 'movies/{id}');
  return testCase.run(del, values, 'delete movie');
})
.then(response => {
  // confirm delete
  var get = group.getRequest('GET', 'movies/{id}');
  return testCase.run(get, values, 'confirm delete');
})
.then(response => {
  // load results
  return limberest.loadFile(options, 'results/expected/movies-api/movie-crud.yaml');
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
  testCase.handleError(err);
  if (demo.getUiCallback()) {
    demo.getUiCallback()(err);
  }
});
