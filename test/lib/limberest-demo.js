'use strict';

// Helper for limberest demo test cases.

// const limberest = require('limberest');
const limberest = require('../../../limberest-js/lib/limberest');
const Logger = limberest.Logger;
const Case = limberest.Case;

function LimberestDemo() {
}

LimberestDemo.prototype.isBrowser = function() {
  return (typeof window !== 'undefined');  
};

LimberestDemo.prototype.setRemote = function(remote) {
  this.remote = remote;
}
LimberestDemo.prototype.isRemote = function() {
  return this.remote || this.isBrowser();
}

// Returns options as appropriate for browser vs local. 
LimberestDemo.prototype.getOptions = function() {
  var testsLoc = '..';
  var path = null;
  
  if (this.isRemote()) {
    // in browser
    testsLoc = 'https://raw.githubusercontent.com/limberest/limberest-demo/master/test';
  }
  return {
    location: testsLoc,
    expectedResultLocation: testsLoc + '/results/expected',
    resultLocation: '../results/actual',
    localLocation: this.isRemote() ? 'ui/test' : null,
    debug: true,
    responseHeaders: ['content-type', 'location'],
    retainResult: true,
    retainLog: true,
    extensions: ['env', 'values']
  }
};

LimberestDemo.prototype.setAuth = function(auth) {
  this.auth = auth;
}
LimberestDemo.prototype.getAuth = function(options) {
  if (this.isBrowser()) {
    return this.auth;
  }
  else {
    return limberest.loadValuesSync(options.location + '/auth.values');
  }
};

LimberestDemo.prototype.setUiCallback = function(callback) {
  this.uiCallback = callback;
};
LimberestDemo.prototype.getUiCallback = function() {
  return this.uiCallback;
};

// TODO: other than Basic
LimberestDemo.prototype.getAuthHeader = function() {
  var auth = this.getAuth(this.getOptions());
  if (this.isBrowser()) {
    return 'Basic ' + btoa(auth.user + ':' + auth.password);
  }
  else {
    return 'Basic ' + new Buffer(auth.user + ':' + auth.password).toString('base64');
  }
};

LimberestDemo.prototype.cleanupMovie = function(group, values) {
  var options = Object.assign({}, this.getOptions(), {retainResult: false, retainLog: false});
  const testCase = new Case('movie-cleanup', options);
  testCase.authHeader = this.getAuthHeader();
  return new Promise(function(resolve, reject) {
    // Run the DELETE request against limberest.io
    var request = group.getRequest('DELETE', 'movies/{id}');
    testCase.run(request, values, 'delete movie')
    .then(response => {
      if (response.status.code === 200 || response.status.code === 404) {
        // success if deleted or not found
        resolve(response);
      }
      else {
        reject(new Error(response.status.code + ': ' + response.status.message), response);
      }
    })
    .catch(err => {
      reject(err);
    });
  });
};

LimberestDemo.prototype.getLogger = function(group, caseName) {
  var options = this.getOptions();
  return new Logger({
    level: options.debug ? 'debug' : 'info',
    location: options.resultLocation + '/' + group,
    name: caseName + '.log', 
    retain: false
  });
  
};

module.exports = new LimberestDemo();