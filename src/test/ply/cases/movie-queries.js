'use strict';

const ply = require('ply-ct');
const demo = require('../lib/ply-demo');
const Case = ply.Case;

var options = demo.getOptions();
const testCase = new Case('movie-queries', options);

// to be replaced once loaded
var group = 'movies-api.postman';
var values = {'base-url': 'https://ply-ct.com/demo/api'};
var request;

ply.loadGroup(options.location + '/' + group)
.then(loadedGroup => {
  group = loadedGroup;
  values.query = 'rating=5&year=1935'; 
  request = group.getRequest('GET', 'movies?{query}');
  return testCase.run(request, values, '5-star movies from 1935');
})
.then(response => {
  values.query = 'title=Phantom'
  return testCase.run(request, values, 'movies with Phantom in the title');
})
.then(response => {
  values.query = 'rating=<2.5&year=<=1933'
  return testCase.run(request, values, 'prohibition-era stinkers');
})
.then(response => {
  values.query = 'sort=rating&descending=true&max=3&search=Bela Lugosi'
  return testCase.run(request, values, 'top three movies with Bela Lugosi');
})
.then(response => {
  values.query = 'sort=year&max=1&search=Alfred Hitchcock'
  return testCase.run(request, values, 'earliest movie directed by Alfred Hitchcock');
})
.then(response => {
  values.query = 'id=8f180e68'
  return testCase.run(request, values, 'query by id');
})
.then(response => {
  // load results
  return ply.loadFile(options, 'results/expected/movies-api/movie-queries.yaml');
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
