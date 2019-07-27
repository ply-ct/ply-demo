'use strict';

// const ply = require('ply-ct');
const ply = require('../../../../../ply/src/ply.js');
const demo = require('../lib/ply-demo');
const Case = ply.Case;

var options = demo.getOptions();
const testCase = new Case('movie-queries', options);

const requests = ply.loadRequests(options.location + '/requests/movie-queries.request.yaml');
const request = requests['moviesQuery'];
var values = ply.loadValues(options.location + '/values/ply-ct.com.values.json');
values.query = 'rating=5&year=1935';

testCase.run(request, values, '5-star movies from 1935')
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
  const expected = ply.loadFile(options.location + '/results/expected/movies-api/movie-queries.yaml');
  // compare expected vs actual
  const res = testCase.verifyResult(expected, values);
})
.catch(err => {
  testCase.handleError(err);
});
