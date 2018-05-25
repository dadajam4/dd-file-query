process.env.NODE_ENV = 'test';

global.fq = require('../lib/fq');
global.assert = require('assert');
global.path = require('path');
global.fs = require('fs-extra');
global.SOURCE_PATH = path.join(__dirname, 'data');
global.WORK_PATH = path.join(__dirname, '.work');

const removeData = () => {
  fs.removeSync(WORK_PATH);
}

const setupData = () => {
  fs.copySync(SOURCE_PATH, WORK_PATH);
}

const beforeEachSetup = done => {
  setupData();
  done();
}


const afterEachSetup = done => {
  removeData();
  done();
}

global.myDescribe = (name, cb) => {
  describe(name, function() {
    beforeEach(beforeEachSetup);
    afterEach(afterEachSetup);
    return cb();
  });
}

removeData();
