const Entry = require('./Entry');
const glob = require('glob');
const Glob = glob.Glob;
const path = require('path');
const yaml = require('js-yaml');

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
];

const FIRST_ENTRY_FOLLOW_METHODS = [
  'getFileType',
  'list',
  'readFile',
  'readText',
  'readJson',
  'readJSON',
  'readYaml',
  'writeFile',
  'writeText',
  'writeJson',
  'writeJSON',
  'writeYaml',
];

const ALL_ENTORY_EACH_METHODS = [
  'del',
  'copy',
  'move',
  'rename',
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

  static getOptionsExt(options = {}) {
    const ext = options.ext;
    return ext ? (Array.isArray(ext) ? ext : [ext]) : [];
  }

  static getOptionsFilters(options = {}) {
    const filters = options.filters;
    return filters ? (Array.isArray(filters) ? filters : [filters]) : [];
  }

  constructor(_pattern, _options) {
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
        this._loadedHooks.push({ resolve, reject });
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
    return this.entries;
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
    return this.first[syncName](...arguments);
  };
}

for (const METHOD of ALL_ENTORY_EACH_METHODS) {
  Entries.prototype[METHOD] = function() {
    const entries = this.getEntries();
    return Promise.all(entries.map(entry => entry[METHOD](...arguments)));
  };
  const syncName = METHOD + 'Sync';
  Entries.prototype[syncName] = function() {
    const entries = this.getEntries();
    return entries.map(entry => entry[syncName](...arguments));
  };
}

module.exports = Entries;