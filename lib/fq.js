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
fq.util = require('./util');

// path for <Entries>(static) methods and factories
[
  'pathExists',
  'pathNotExists',
  'createSafePath',
  'single',
  'list',
  'dir',
  'file',
  'emptyDir',
  'ensureDir',
  'ensureFile',
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
  'readFileAll',
  'readTextAll',
  'readJsonAll',
  'readJSONAll',
  'readYamlAll',
  'delAll',
  'copyAll',
  'duplicateAll',
  'moveAll',
  'renameAll',
  'zipAll',
  'unzipAll',
  'watchAll',
].forEach(key => {
  const syncKey = key + 'Sync';
  fq[key] = async function(pattern, ...args) {
    let options;
    if (typeof pattern === 'object') {
      options = pattern.options;
      pattern = pattern.pattern;
    }
    const entries = await fq(pattern, options);
    await entries.load();
    return await entries[key](...args);
  };

  fq[syncKey] = function(pattern, ...args) {
    let options;
    if (typeof pattern === 'object') {
      options = pattern.options;
      pattern = pattern.pattern;
    }
    const entries = fq.sync(pattern, options);
    if (entries[syncKey]) return entries[syncKey](...args);
    return entries[key](...args);
  };
});

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

// path for <Entory> methods
[
  'getFileType',
  'detectEncoding',
  'del',
  'copy',
  'duplicate',
  'move',
  'rename',
  'readFile',
  'readText',
  'readJson',
  'readJSON',
  'readYaml',
  'zip',
  'unzip',
  'tree',
  'watch',
].forEach(key => {
  const syncKey = key + 'Sync';
  fq[key] = async function(path, ...args) {
    const entry = await fq.single(path);
    return entry && (await entry[key](...args));
  };

  fq[syncKey] = function(path, ...args) {
    const entry = fq.singleSync(path);
    if (!entry) return;
    if (entry[syncKey]) return entry[syncKey](...args);
    return entry[key](...args);
  };
});

module.exports = fq;
