'use strict';

/** 
 * Programmatically run an orchestrated sequence of tests 
 * using promise syntax. TODO: regex example
 */ 

const ply = require('ply-ct');
const demo = require('../lib/ply-demo');
const Case = ply.Case;

var options = demo.getOptions();
const testCase = new Case('movie-crud', options);
testCase.authHeader = demo.getAuthHeader();

const values = {
  'baseUrl': 'https://ply-ct.com/demo/api',
  id: '435b30ad'
};
const logger = demo.getLogger('movies-api', testCase.name);

var suiteName = 'movies-api.postman';
var group;

ply.loadGroup(options.location + '/' + suiteName)
.then(loadedGroup => {
  group = loadedGroup;
  return demo.cleanupMovie(group, values);
})
.then(() => {
  logger.info('Cleanup completed for movie: ' + values.id);
  var post = group.getRequest('POST', 'Create Movie');
  return testCase.run(post, values, 'create movie');
})
.then(response => {
  // update it (with programmatically-set rating)
  values.rating = 4.5;
  var put = group.getRequest('PUT', 'Update Movie');
  return testCase.run(put, values, 'update rating');
})
.then(response => {
  // confirm update
  var get = group.getRequest('GET', 'Movie by ID');
  return testCase.run(get, values, 'confirm update');
})
.then(response => {
  // delete it
  var del = group.getRequest('DELETE', 'Delete Movie');
  return testCase.run(del, values, 'delete movie');
})
.then(response => {
  // confirm delete
  var get = group.getRequest('GET', 'Movie by ID');
  return testCase.run(get, values, 'confirm delete');
})
.then(response => {
  // load results
  return ply.loadFile(options, 'results/expected/movies-api/movie-crud.yaml');
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
  testCase.handleError(err);
  if (demo.getUiCallback()) {
    demo.getUiCallback()(err);
  }
});
