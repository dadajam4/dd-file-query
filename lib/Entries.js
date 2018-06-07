const Entry = require('./Entry');
const glob = require('glob');
const Glob = glob.Glob;
const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
const parsePath = require('parse-filepath');
const archiver = require('archiver');

const ARRAY_EXTENDS_METHODS = [
  'every',
  'filter',
  'find',
  'findIndex',
  'forEach',
  'includes',
  'indexOf',
  'map',
  'reduce',
  'reduceRight',
  'some',
];

const FIRST_ENTRY_FOLLOW_PROPS = [
  'path',
  'dirname',
  'ext',
  'extname',
  'name',
  'basename',
  'isDir',
  'isFile',
  'isSocket',
  'deleted',
  'watcher',
];

const FIRST_ENTRY_FOLLOW_METHODS = [
  'del',
  'copy',
  'duplicate',
  'move',
  'rename',
  'getFileType',
  'detectEncoding',
  'list',
  'createRenamedPath',
  'readFile',
  'readText',
  'readJson',
  'readJSON',
  'readYaml',
  'emptyDir',
  'ensureDir',
  'ensureFile',
  'writeFile',
  'writeText',
  'writeJson',
  'writeJSON',
  'writeYaml',
  'zip',
  'unzip',
  'tree',
  'watch',
  'watchOn',
  'unwatch',
];

// Auto add suffix 'All'
const ALL_ENTORY_EACH_METHODS = [
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
  'watch',
  'watchOn',
  'unwatch',
];

const ENSURE_FACTORIES = [
  'emptyDir',
  'ensureDir',
  'ensureFile',
];

class Entries {
  get loaded() { return this._loadState === 'loaded' }
  get loading() { return this._loadState === 'loading' }
  get loaderror() { return this._loadState === 'error' }
  get _found() { return this.glob && this.glob.found || [] }
  get found() { return this.entries.map(entry => entry.path) }
  get statCache() { return this.glob && this.glob.statCache || {} }
  get length() { return this.entries.length }
  get first() { return this.get(0) }
  get last() { return this.get(this.length - 1) }
  get size() {
    if (this.length === 0) return;
    if (this.length === 1) return this.first.size;
    return this.entries.reduce((a, b) => (a.size + b.size))
  }
  get foundPattern() { return '{' + this.found.join(',') + '}' }

  static getOptionsExt(options = {}) {
    const ext = options.ext;
    return ext ? (Array.isArray(ext) ? ext : [ext]) : [];
  }

  static getOptionsFilters(options = {}) {
    const filters = options.filters;
    return filters ? (Array.isArray(filters) ? filters : [filters]) : [];
  }

  constructor(_pattern, _options) {
    this.util = this.constructor.util;
    _options = typeof _options === 'boolean' ? { sync: _options } : _options;
    const [pattern, options] = this.constructor.getRecursivePatternedArgs(_pattern, _options);
    this.pattern = pattern;
    this.options = Object.assign({}, options, { stat: true });
    const isSync = this.options.sync;
    delete this.options.sync;
    this.filters = this.constructor.getOptionsFilters(options);
    delete this.options.filters;
    this.glob = null;
    this._loadState = 'pending';
    this._loadedHooks = [];
    this.entries = [];
    this.hasMagic = glob.hasMagic(this.pattern, this.options);
    if (isSync) this.load(true);
  }

  static sync(pattern, options = {}) {
    options = typeof options === 'boolean' ? { sync: options } : options;
    options.sync = true;
    return new this(pattern, options);
  }

  static async single(pattern, options) {
    const context = new this(pattern, options);
    await context.load();
    return context.first;
  }

  static singleSync(pattern, options) {
    const context = this.sync(pattern, options);
    return context.first;
  }

  static getRecursivePatternedArgs(basepath, _options = {}, defaultPattern = '') {
    const options = { ..._options };
    const isRecursive = !!options.recursive || !!options.r;
    delete options.recursive;
    delete options.r;
    const recursivePattern = isRecursive ? '**/*' : defaultPattern;
    return [
      (recursivePattern ? path.join(basepath, recursivePattern) : basepath),
      options,
    ];
  }

  static createListArgs(basepath, options) {
    return this.getRecursivePatternedArgs(basepath, options, '*');
  }

  static createFilteringArgs(filter, basepath, _options) {
    const args = this.createListArgs(basepath, _options);
    const options = args[1];
    options.filters = this.getOptionsFilters(options);
    options.filters.unshift(filter);
    return args;
  }

  static list(basepath, options) {
    const args = this.createListArgs(basepath, options);
    return new this(...args);
  }

  static listSync(basepath, options) {
    const args = this.createListArgs(basepath, options);
    args[1].sync = true;
    return new this(...args);
  }

  static createDirArgs(basepath, options) {
    return this.createFilteringArgs(
      entry => entry.isDir,
      basepath,
      options
    )
  }

  static dir(basepath, options) {
    const args = this.createDirArgs(basepath, options);
    return new this(...args);
  }

  static dirSync(basepath, options) {
    const args = this.createDirArgs(basepath, options);
    args[1].sync = true;
    return new this(...args);
  }

  static createFileArgs(basepath, options) {
    return this.createFilteringArgs(
      entry => entry.isFile,
      basepath,
      options
    )
  }

  static file(basepath, options) {
    const args = this.createFileArgs(basepath, options);
    return new this(...args);
  }

  static fileSync(basepath, options) {
    const args = this.createFileArgs(basepath, options);
    args[1].sync = true;
    return new this(...args);
  }

  static async writeFile(filepath, ...args) {
    await fs.writeFile(filepath, ...args);
    const entry = await this.single(filepath);
    return entry;
  }

  static writeFileSync(filepath, ...args) {
    fs.writeFileSync(filepath, ...args);
    const entry = this.singleSync(filepath);
    return entry;
  }

  static writeText() {
    return this.writeFile(...arguments);
  }

  static writeTextSync() {
    return this.writeFileSync(...arguments);
  }

  static async writeJson(filepath, ...args) {
    await fs.writeJson(filepath, ...args);
    const entry = await this.single(filepath);
    return entry;
  }

  static writeJsonSync(filepath, ...args) {
    fs.writeJsonSync(filepath, ...args);
    const entry = this.singleSync(filepath);
    return entry;
  }

  static writeJSON() {
    return this.writeJson(...arguments);
  }

  static writeJSONSync() {
    return this.writeJsonSync(...arguments);
  }

  static async writeYaml(filepath, json, options) {
    const args = Entry.createWriteYamlArgs(options);
    const text = yaml[args.handlerName](json, args.options);
    await this.writeText(filepath, text);
    const entry = await this.single(filepath);
    return entry;
  }

  static writeYamlSync(filepath, json, options) {
    const args = Entry.createWriteYamlArgs(options);
    const text = yaml[args.handlerName](json, args.options);
    this.writeTextSync(filepath, text);
    const entry = this.singleSync(filepath);
    return entry;
  }

  static pathExists(path) {
    return new Promise((resolve, reject) => {
      fs.pathExists(path, (err, exists) => {
        if (err) return reject(err);
        return resolve(exists);
      });
    });
  }

  static pathExistsSync(path) {
    return fs.existsSync(path);
  }

  static async pathNotExists(path) {
    return !(await this.pathExists(path));
  }

  static pathNotExistsSync(path) {
    return !this.pathExistsSync(path);
  }

  static getCreateSafePathParams(fullpath, {
    prefix = '_',
    suffix = '',
    start = 1,
  } = {}, isSync = false) {
    const { dirname, name, ext } = parsePath(fullpath);
    return {
      prefix,
      suffix,
      start,
      dirname,
      name,
      ext,
      resolved: false,
      ammount: 0,
      createdFilename: null,
      createdPath: null,
      isSync,
    }
  }

  static createSafePathTick(p) {
    const handler = p.isSync ? 'pathNotExistsSync' : 'pathNotExists';
    const value = p.ammount === 0 ? '' : p.prefix + p.ammount + p.suffix;
    p.createdFilename = p.name + value + p.ext;
    p.createdPath = path.join(p.dirname, p.createdFilename);
    if (p.ammount === 0) {
      p.ammount = p.start;
    } else {
      p.ammount++;
    }
    return this[handler](p.createdPath);
  }

  static async createSafePath(fullpath, setting) {
    const p = this.getCreateSafePathParams(fullpath, setting);
    while (!p.resolved) {
      p.resolved = await this.createSafePathTick(p);
    }
    return p.createdPath;
  }

  static createSafePathSync(fullpath, setting) {
    const p = this.getCreateSafePathParams(fullpath, setting, true);
    while (!p.resolved) {
      p.resolved = this.createSafePathTick(p);
    }
    return p.createdPath;
  }

  extend(pattern, options = {}) {
    const mergedOptions = Object.assign({}, this.options, options);
    return new this.constructor(pattern, mergedOptions);
  }

  createGlobOptions(isSync) {
    return Object.assign({sync: isSync}, this.options);
  }

  resolveLoadedHooks(err) {
    this._loadState = err ? 'error' : 'loaded';
    for (const hook of this._loadedHooks) {
      hook[err ? 'reject' : 'resolve'](err || this.entries);
    }
  }

  load(isSync = false, relatedEntries) {
    this._loadState = 'loading';
    if (isSync) {
      this.glob = new Glob(this.pattern, this.createGlobOptions(true));
      this._loadState = 'loaded';
      return this._loadEntries(relatedEntries);
    } else {
      return new Promise((resolve, reject) => {
        this._loadedHooks.push({ resolve: () => resolve(this), reject });
        this.glob = new Glob(this.pattern, this.createGlobOptions(false), (err, files) => {
          if (!err) this._loadEntries(relatedEntries);
          this.resolveLoadedHooks();
        });
      });
    }
  }

  _loadEntries(relatedEntries) {
    this.entries = this._found.map(file => {
      const stats = this.statCache[file];
      const relatedEntry = relatedEntries && relatedEntries.find(e => e.path === file);
      if (relatedEntry) {
        relatedEntry.setStats(stats);
        return relatedEntry;
      }
      return new Entry(this, file, stats);
    });

    if (this.filters.length) {
      this.entries = this.entries.filter(entry => {
        for (const filter of this.filters) {
          if (!filter(entry)) return false;
        }
        return true;
      });
    }
    return this;
  }

  getEntries() {
    return this.entries.slice();
  }

  [Symbol.iterator]() {
    return this._createIterator();
  }

  get(index) {
    return this.entries[index];
  }

  _createIterator() {
    const iterator = {};
    let cursor = 0;
    const entries = this.getEntries();

    iterator.next = () => {
      const value = entries[cursor];
      const iteratorResult = {
        value,
        done: cursor === entries.length,
      };
      cursor++;
      return iteratorResult;
    }
    return iterator;
  }

  _onDelDirEntry(entry) {
    const relatedEntries = this.filter(e => e.dirname === entry.path);
    relatedEntries.forEach(e => {
      e.deleted = true;
    });
  }
}

for (const METHOD of ARRAY_EXTENDS_METHODS) {
  Entries.prototype[METHOD] = function() {
    return this.getEntries()[METHOD](...arguments);
  };
}

for (const PROP of FIRST_ENTRY_FOLLOW_PROPS) {
  Object.defineProperty(Entries.prototype, PROP, {
    enumerable: true,
    configurable: true,
    get() { return this.first && this.first[PROP] },
  });
}

for (const METHOD of FIRST_ENTRY_FOLLOW_METHODS) {
  Entries.prototype[METHOD] = function() {
    if (!this.first) return Promise.resolve();
    return this.first[METHOD](...arguments);
  };
  const syncName = METHOD + 'Sync';
  Entries.prototype[syncName] = function() {
    if (!this.first) return;
    if (this.first[syncName]) return this.first[syncName](...arguments);
    return this.first[METHOD](...arguments);
  };
}

for (const METHOD of ALL_ENTORY_EACH_METHODS) {
  const name = METHOD + 'All';
  const entryMethodName = METHOD;
  const syncName = name + 'Sync';
  const syncEntryMethodName = METHOD + 'Sync';
  Entries.prototype[name] = function() {
    const entries = this.getEntries();
    return Promise.all(entries.map(entry => entry[entryMethodName](...arguments)));
  };
  Entries.prototype[syncName] = function() {
    const entries = this.getEntries();
    return entries.map(entry => {
      if (entry[syncEntryMethodName]) return entry[syncEntryMethodName](...arguments);
      return entry[entryMethodName](...arguments);
    });
  };
}

for (const METHOD of ENSURE_FACTORIES) {

  // statics
  Entries[METHOD] = function(path) {
    return fs[METHOD](path)
      .then(() => {
        return this.single(path);
      })
  };
  const syncName = METHOD + 'Sync';
  Entries[syncName] = function(path) {
    fs[syncName](path);
    return this.singleSync(path);
  };
}

Entries.util = require('./util');

module.exports = Entries;