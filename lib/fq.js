const Entries = require('./Entries');

// basic factory
function fq(pattern, options) {
  return new Entries(pattern, options);
}

fq.sync = function(pattern, options) {
  return Entries.sync(pattern, options);
};

fq.load = async function(pattern, options) {
  const entries = fq(pattern, options);
  await entries.load();
  return entries;
};

// utilities reference
fq.utils = {
  fs: require('fs-extra'),
  glob: require('glob'),
  parseFilePath: require('parse-filepath'),
  yaml: require('js-yaml'),
  fileType: require('file-type'),
};

// path for <Entries> factories
[
  'single',
  'list',
  'dir',
  'file',
  'writeFile',
  'writeText',
  'writeJson',
  'writeJSON',
  'writeYaml',
].forEach(key => {
  const syncKey = key + 'Sync';
  fq[key] = function() {
    return Entries[key](...arguments);
  };
  fq[syncKey] = function() {
    return Entries[syncKey](...arguments);
  };
});

// path for <Entries> actions. with load
[
  'getFileType',
  'del',
  'copy',
  'move',
  'rename',
].forEach(key => {
  const syncKey = key + 'Sync';
  fq[key] = async function(pattern, ...args) {
    const entries = await fq(pattern);
    await entries.load();
    return await entries[key](...args);
  };

  fq[syncKey] = function(pattern, ...args) {
    const entries = fq.sync(pattern);
    return entries[syncKey](...args);
  };
});

// exist checkers
fq.isExist = async function(path) {
  const entry = await fq.single(path);
  return !!entry;
};

fq.isExistSync = function(path) {
  const entry = fq.singleSync(path);
  return !!entry;
};

fq.isNotExist = async function(path) {
  const entry = await fq.single(path);
  return !entry;
};

fq.isNotExistSync = function(path) {
  const entry = fq.singleSync(path);
  return !entry;
};

// path for <Entory> getters
[
  'isFile',
  'isDir',
  'isSocket',
].forEach(key => {
  fq[key] = async function(path) {
    const entry = await fq.single(path);
    return (entry && entry[key]) || false;
  };

  fq[key + 'Sync'] = function(path) {
    const entry = fq.singleSync(path);
    return (entry && entry[key]) || false;
  };
});

// path for <Entory>(.isFile) methods
[
  'readFile',
  'readText',
  'readJson',
  'readJSON',
  'readYaml',
].forEach(key => {
  const syncKey = key + 'Sync';
  fq[key] = async function(path, ...args) {
    const entry = await fq.single(path);
    return entry && entry.isFile && (await entry[key](...args));
  };

  fq[syncKey] = function(path, ...args) {
    const entry = fq.singleSync(path);
    return entry && entry.isFile && entry[syncKey](...args);
  };
});

module.exports = fq;
