'use strict';

// Helper for ply demo test cases.

const ply = require('ply-ct');
// const ply = require('../../../ply/lib/ply');
const Logger = ply.Logger;
const Case = ply.Case;

function PlyDemo() {
}

PlyDemo.prototype.isBrowser = function() {
  return (typeof window !== 'undefined');  
};

PlyDemo.prototype.setRemote = function(remote) {
  this.remote = remote;
}
PlyDemo.prototype.isRemote = function() {
  return this.remote || this.isBrowser();
}

// Returns options as appropriate for browser vs local. 
PlyDemo.prototype.getOptions = function() {
  var testsLoc = '..';
  var path = null;
  
  if (this.isRemote()) {
    // in browser
    testsLoc = 'https://raw.githubusercontent.com/ply-ct/ply-demo/master/src/test/ply';
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

PlyDemo.prototype.setAuth = function(auth) {
  this.auth = auth;
}
PlyDemo.prototype.getAuth = function(options) {
  if (this.isBrowser()) {
    return this.auth;
  }
  else {
    return ply.loadValuesSync(options.location + '/auth.values');
  }
};

PlyDemo.prototype.setUiCallback = function(callback) {
  this.uiCallback = callback;
};
PlyDemo.prototype.getUiCallback = function() {
  return this.uiCallback;
};

// TODO: other than Basic
PlyDemo.prototype.getAuthHeader = function() {
  var auth = this.getAuth(this.getOptions());
  if (this.isBrowser()) {
    return 'Basic ' + btoa(auth.user + ':' + auth.password);
  }
  else {
    return 'Basic ' + new Buffer(auth.user + ':' + auth.password).toString('base64');
  }
};

PlyDemo.prototype.cleanupMovie = function(group, values) {
  var options = Object.assign({}, this.getOptions(), {retainResult: false, retainLog: false});
  const testCase = new Case('movie-cleanup', options);
  testCase.authHeader = this.getAuthHeader();
  return new Promise(function(resolve, reject) {
    // Run the DELETE request against ply-ct.com
    var request = group.getRequest('DELETE', 'Delete Movie');
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

PlyDemo.prototype.getLogger = function(group, caseName) {
  var options = this.getOptions();
  return new Logger({
    level: options.debug ? 'debug' : 'info',
    location: options.resultLocation + '/' + group,
    name: caseName + '.log', 
    retain: false
  });
  
};

module.exports = new PlyDemo();