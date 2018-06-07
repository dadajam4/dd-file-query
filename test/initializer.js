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

const setupData = (data = '1') => {
  fs.copySync(path.join(SOURCE_PATH, String(data)), WORK_PATH);
}

const beforeEachSetup = (data, done) => {
  setupData(data);
  done();
}


const afterEachSetup = done => {
  removeData();
  done();
}

global.myDescribe = (name, opts, cb) => {
  if (typeof opts === 'function') cb = opts;
  opts = opts || {};
  const data = opts.data || '1';

  describe(name, function() {
    beforeEach(done => {
      beforeEachSetup(data, done);
    });
    afterEach(afterEachSetup);
    return cb();
  });
}

removeData();
