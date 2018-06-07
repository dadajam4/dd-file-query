const parsePath = require('parse-filepath');
const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
const fileType = require('file-type');
const archiver = require('archiver');
const decompress = require('decompress');
const TreeSource = require('./TreeSource');
const glob = require('glob');
const iconv = require('iconv-lite');
const chardet = require('chardet');
const chokidar = require('chokidar');

const DIR_ENSURE_FACTORIES = [
  'emptyDir',
  'ensureDir',
  'ensureFile',
];

const NATIVE_SUPPORTS_ENCODINGS = [
  'ascii',
  'base64',
  'binary',
  'hex',
  'ucs2',
  'ucs-2',
  'utf16le',
  'utf-16le',
  'utf8',
  'utf-8',
  'latin1',
];

const WATCH_EVENTS = [
  'add',
  'change',
  'unlink',
  'addDir',
  'unlinkDir',
  'error',
  'ready',
  'raw',
];

const IS_NATIVE_SUPPORTS_ENCODING = char => NATIVE_SUPPORTS_ENCODINGS.includes(char.toLowerCase());

class Entry {

  get excludeExtPath() { return path.join(this.dirname, this.name)  }
  get watcher() { return this._watcher }

  constructor(context, path, stats) {
    this.util = this.constructor.util;
    this.context = context;
    this.setStats(stats);
    this.path = path;

    const parsedPath = parsePath(path);
    this.dirname = parsedPath.dirname;
    this.ext = parsedPath.ext;
    this.extname = this.ext && this.ext.replace('.', '');
    this.name = parsedPath.name;
    this.basename = parsedPath.basename;
    this.deleted = false;
  }

  getExtReplacedBasename(ext) { return this.name + '.' + ext }
  getExtReplacedPath(ext) { return path.join(this.dirname, this.getExtReplacedBasename(ext)) }

  setStats(stats) {
    this.stats = stats;
    this.size = this.stats.size;
    this.isDir = stats.isDirectory();
    this.isFile = stats.isFile();
    this.isSocket = stats.isSocket();
    this.atime = stats.atime;
    this.btime = stats.btime;
    this.ctime = stats.ctime;
    this.birthtime = stats.birthtime;
  }

  createRenamedPath(newName) {
    return path.join(this.dirname, newName);
  }

  breed(pattern, options) {
    return new this.context.constructor(pattern, options);
  }

  createFindDefine(pattern = '*', options = {}) {
    if (!this.isDir) throw new Error('Children can make it only in the directory.');
    return {
      pattern: path.join(this.path, pattern),
      options: options,
    }
  }

  async getFileType() {
    const buffer = await this.readFile();
    return fileType(buffer);
  }

  getFileTypeSync() {
    const buffer = this.readFileSync();
    return fileType(buffer);
  }

  async list(pattern, options) {
    const define = this.createFindDefine(pattern, options);
    define.options.sync = false;
    const finded = this.breed(define.pattern, define.options);
    await finded.load();
    return finded;
  }

  listSync(pattern, options) {
    const define = this.createFindDefine(pattern, options);
    define.options.sync = true;
    const finded = this.breed(define.pattern, define.options);
    return finded;
  }

  detectEncodingBySource(source, opts) {
    if (typeof source === 'string') source = Buffer.from(source, 'utf8');
    return chardet.detect(source, opts);
  }

  detectEncoding(opts, source) {
    if (source && typeof source !== 'object') return this.detectEncodingBySource(source, opts);
    if (source && !opts) opts = source;
    return new Promise((resolve, reject) => {
      chardet.detectFile(this.path, opts, (err, encoding) => {
        if (err) return reject(err);
        resolve(encoding);
      });
    });
  }

  detectEncodingSync(source, opts) {
    if (source && typeof source !== 'object') return this.detectEncodingBySource(source, opts);
    if (source && !opts) opts = source;
    return chardet.detectFileSync(this.path, opts);
  }

  _readFile(isSync = false, encoding = null) {
    let decodeEncoding;
    const fsHandler = isSync ? 'readFileSync' : 'readFile';
    if (encoding) {
      if (!IS_NATIVE_SUPPORTS_ENCODING(encoding)) {
        decodeEncoding = encoding;
        encoding = null;
      }
    }

    const fsResult = fs[fsHandler](this.path, encoding);
    if (!decodeEncoding) return fsResult;
    if (isSync) return iconv.decode(fsResult, decodeEncoding);
    return fsResult.then(buffer => iconv.decode(buffer, decodeEncoding));
  }

  readFile() {
    return this._readFile(false, ...arguments);
  }

  readFileSync() {
    return this._readFile(true, ...arguments);
  }

  readText(charset = 'utf8') {
    return this.readFile(charset);
  }

  readTextSync(charset = 'utf8') {
    return this.readFileSync(charset);
  }

  readJson() {
    const args = [this.path, ...arguments];
    return fs.readJSON(...args);
  }

  readJsonSync() {
    const args = [this.path, ...arguments];
    return fs.readJSONSync(...args);
  }

  readJSON() { return this.readJson(...arguments) }
  readJSONSync() { return this.readJsonSync(...arguments) }

  createYamlArgs(_options = {}) {
    const options = { ..._options };
    const safe = options.safe === undefined ? true : options.safe;
    const all = options.all === undefined ? false : options.all;
    delete options.safe;
    delete options.all;
    const prefix = safe ? 'safe' : '';
    const action = prefix ? 'Load' : 'load';
    const suffix = all ? 'All' : '';
    const handlerName = prefix + action + suffix;
    return {
      handlerName,
      options,
    }
  }

  async readYaml(options) {
    const args = this.createYamlArgs(options);
    const doc = await this.readText();
    const json = yaml[args.handlerName](doc, args.options);
    return json;
  }

  readYamlSync(options) {
    const args = this.createYamlArgs(options);
    const doc = this.readTextSync();
    const json = yaml[args.handlerName](doc, args.options);
    return json;
  }

  del() {
    if (this.deleted) return Promise.resolve();
    return fs.remove(this.path)
      .then(() => {
        this.deleted = true;
        this.isDir && this.context._onDelDirEntry(this);
        return this.context.load();
      })
  }

  delSync() {
    if (this.deleted) return;
    fs.removeSync(this.path);
    this.deleted = true;
    this.isDir && this.context._onDelDirEntry(this);
    this.context.load(true);
  }

  async copy(dest, options = {}) {
    if (typeof dest === 'function') dest = dest(this);
    await fs.copy(this.path, dest, options);
    const copied = this.breed(dest);
    await copied.load();
    return copied.first;
  }

  copySync(dest, options = {}) {
    if (typeof dest === 'function') dest = dest(this);
    fs.copySync(this.path, dest, options);
    const copied = this.breed(dest, true);
    return copied.first;
  }

  getDuplicatePath({ dest, prefix = '_copy_', start } = {}, isSync = false) {
    const target = dest ? (typeof dest === 'function' ? dest(this) : path.join(this.dirname, dest)) : this.path;
    return this.context.constructor[isSync ? 'createSafePathSync' : 'createSafePath'](this.path, { prefix, start });
  }

  async duplicate(setting) {
    const dest = await this.getDuplicatePath(setting);
    const copied = await this.copy(dest);
    return copied;
  }

  duplicateSync(setting) {
    const dest = this.getDuplicatePath(setting, true);
    const copied = this.copySync(dest);
    return copied;
  }

  async move(dest, options = {}) {
    if (typeof dest === 'function') dest = dest(this);
    await fs.move(this.path, dest, options);
    const moved = this.breed(dest);
    await Promise.all([
      this.context.load(),
      moved.load(),
    ]);
    return moved.first;
  }

  moveSync(dest, options = {}) {
    if (typeof dest === 'function') dest = dest(this);
    fs.moveSync(this.path, dest, options);
    const moved = this.breed(dest, true);
    this.context.load(true);
    return moved;
  }

  async rename(newName) {
    if (typeof newName === 'function') newName = newName(this);
    const dest = this.createRenamedPath(newName);
    await fs.rename(this.path, dest);
    await this.context.load();
    const renamedEntry = this.context.find(entry => entry.path === dest);
    if (renamedEntry) return renamedEntry.context;
    const renamed = this.breed(dest);
    await renamed.load();
    return renamed;
  }

  renameSync(newName) {
    if (typeof newName === 'function') newName = newName(this);
    const dest = this.createRenamedPath(newName);
    fs.renameSync(this.path, dest);
    this.context.load(true);
    const renamedEntry = this.context.find(entry => entry.path === dest);
    if (renamedEntry) return renamedEntry.context;
    const renamed = this.breed(dest, true);
    return renamed;
  }

  async writeFile(...args) {
    const result = await fs.writeFile(this.path, ...args);
    await this.context.load(false, [this]);
    return result;
  }

  writeFileSync(...args) {
    const result = fs.writeFileSync(this.path, ...args);
    this.context.load(true, [this]);
    return result;
  }

  writeText(text, charset) {
    if (charset) text = iconv.encode(text, charset);
    return this.writeFile(text);
  }

  writeTextSync(text, charset) {
    if (charset) text = iconv.encode(text, charset);
    return this.writeFileSync(text);
  }

  async writeJson(object, options) {
    const result = await fs.writeJson(this.path, object, options);
    await this.context.load(false, [this]);
    return result;
  }

  writeJsonSync(object, options) {
    const result = fs.writeJsonSync(this.path, object, options);
    this.context.load(true, [this]);
    return result;
  }

  writeJSON() {
    return this.writeJSON(...arguments);
  }

  writeJSONSync() {
    return this.writeJSONSync(...arguments);
  }

  static createWriteYamlArgs(_options = {}) {
    const options = { ..._options };
    const safe = options.safe === undefined ? true : options.safe;
    delete options.safe;
    const prefix = safe ? 'safe' : '';
    const action = prefix ? 'Dump' : 'dump';
    const handlerName = prefix + action;
    return {
      handlerName,
      options,
    }
  }

  async writeYaml(object, options) {
    const args = this.constructor.createWriteYamlArgs(options);
    const text = yaml[args.handlerName](object, args.options);
    const result = await this.writeText(text);
    return result;
  }

  writeYamlSync(object, options) {
    const args = this.constructor.createWriteYamlArgs(options);
    const text = yaml[args.handlerName](object, args.options);
    const result = this.writeTextSync(text);
    return result;
  }

  createZipPath() {
    const searchPath = this.getExtReplacedPath('zip');
    return this.context.constructor.createSafePath(searchPath);
  }

  zip(dest, {
    level = 9,
    onWarning,
  } = {}) {
    return new Promise(async (resolve, reject) => {
      if (dest) {
        if (typeof dest === 'function') dest = dest(this);
      } else {
        dest = await this.createZipPath();
      }
      if (await fs.pathExists(dest)) return reject(new Error(`"${dest}" already exists.`));

      const output = fs.createWriteStream(dest);
      const archive = archiver('zip', {
        zlib: { level },
      });

      output.on('close', async () => {
        const entry = await this.context.constructor.single(dest);
        resolve(entry);
      });

      archive.on('warning', err => {
        if (err.code === 'ENOENT') {
          if (typeof onWarning === 'function') {
            onWarning(err);
          }
        } else {
          reject(err);
        }
      });

      archive.on('error', reject);

      archive.pipe(output);

      if (this.isDir) {
        archive.directory(this.path, false);
      } else {
        archive.file(this.path, { name: this.basename });
      }

      archive.finalize();
    });
  }

  unzip(dest, options) {
    return new Promise(async (resolve, reject) => {
      if (!dest) {
        dest = path.join(this.dirname, this.name);
        dest = await this.context.constructor.createSafePath(dest);
      }
      if (typeof dest === 'function') dest = dest(this);
      if (await fs.pathExists(dest)) return reject(new Error(`"${dest}" already exists.`));

      const files = await decompress(this.path, dest, options);
      const entry = await this.context.constructor.single(dest);
      resolve(entry);
    });
  }

  _createTreeParams({ dir = false, depth = null } = {}, sync = false) {
    const globPattern = path.join(this.path, '**/*');
    const resolver = _list => {
      let list = [];
      const paths = [this.path];
      const filters = dir && [e => e.isDir];

      for (const _row of _list) {
        const absolutePath = _row.replace(this.path, '');
        const myDepth = absolutePath.split(path.sep).length - 1;
        if (depth && depth > myDepth) continue;
        paths.push(_row);
        const row = {
          path: _row,
          absolutePath,
          depth: myDepth,
        };
        list.push(row);
      }

      list.unshift({
        path: this.path,
        absolutePath: '/',
        depth: 0,
      });

      const pattern = '{' + paths.join(',') + '}';
      return {
        list,
        pattern,
        filters,
      }
    }

    if (sync) {
      return resolver(glob.sync(globPattern));
    } else {
      return new Promise((resolve, reject) => {
        glob(globPattern, (err, files) => {
          if (err) return reject(err);
          resolve(resolver(files));
        });
      });
    }
  }

  _createTreeRootByListAndEntries({
    list,
    entries,
  } = {}) {
    const levels = [];
    list = list.filter(row => entries.found.includes(row.path));
    for (const row of list) {
      row.entry = entries.find(e => e.path === row.path);
      if (row.entry.isDir) {
        row.children = [];
      }
    }

    const _root = list[0];
    for (let i = 1, l = list.length; i < l; i++) {
      const row = list[i];
      const parent = list.find(target => target.path === row.entry.dirname);
      parent.children.push(row);
      row.parent = parent;
    }

    return new TreeSource(_root);
  }

  async tree(setting) {
    const { list, pattern, filters } = await this._createTreeParams(setting);
    const entries = this.breed(pattern, { filters });
    await entries.load();
    const treeRoot = this._createTreeRootByListAndEntries({ list, entries });
    return treeRoot;
  }

  treeSync(setting) {
    const { list, pattern, filters } = this._createTreeParams(setting, true);
    const entries = this.breed(pattern, { filters, sync: true });
    const treeRoot = this._createTreeRootByListAndEntries({ list, entries });
    return treeRoot;
  }

  watch(arg1, arg2, arg3) {
    let on;
    let options;

    if (typeof arg1 === 'string' && typeof arg2 === 'function') {
      on = {[arg1]: arg2};
      options = arg3;
    } else {
      on = arg1;
      options = arg2;
    }

    this.unwatch();
    this._watcher = chokidar.watch(this.path, options);

    for (const event in on) {
      this.watchOn(event, on[event]);
    }

    return this;
  }

  watchOn(event, cb) {
    this._watcher.on(event, (...args) => cb(this, ...args));
    return this;
  }

  unwatch() {
    if (this._watcher) {
      this._watcher.unwatch();
      this._watcher.close();
      delete this._watcher;
    }
    return this;
  }
}

for (const METHOD of DIR_ENSURE_FACTORIES) {
  const reciever = function(handler, name = '') {
    if (!this.isDir) throw new Error(`[${METHOD}] This method is only available for directories.`);
    const target = path.join(this.path, name);
    return this.context.constructor[handler](target);
  };

  Entry.prototype[METHOD] = async function(name) {
    const result = await reciever.call(this, METHOD, name);
    await this.context.load(false, [result]);
    return this.context.find(entry => entry.path === result.path) || result;
  };

  const syncName = METHOD + 'Sync';
  Entry.prototype[syncName] = function(name) {
    const result = reciever.call(this, syncName, name);
    this.context.load(true, [result]);
    return this.context.find(entry => entry.path === result.path) || result;
  };
}

Entry.util = require('./util');

module.exports = Entry;