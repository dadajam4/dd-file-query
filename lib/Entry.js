const parsePath = require('parse-filepath');
const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
const fileType = require('file-type');

class Entry {

  constructor(context, path, stats) {
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

  setStats(stats) {
    this.stats = stats;
    this.size = this.stats.size;
    this.isDir = stats.isDirectory();
    this.isFile = stats.isFile();
    this.isSocket = stats.isSocket();
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

  readFile() {
    const args = [this.path, ...arguments];
    return fs.readFile(...args);
  }

  readFileSync() {
    const args = [this.path, ...arguments];
    return fs.readFileSync(...args);
  }

  readText(charset = 'utf-8') {
    return fs.readFile(this.path, charset);
  }

  readTextSync(charset = 'utf-8') {
    return fs.readFileSync(this.path, charset);
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

  async copy() {
    const args = [this.path, ...arguments];
    if (typeof args[1] === 'function') args[1] = args[1](this);
    await fs.copy(...args);
    const copied = this.breed(args[1]);
    await copied.load();
    return copied;
  }

  copySync() {
    const args = [this.path, ...arguments];
    if (typeof args[1] === 'function') args[1] = args[1](this);
    fs.copySync(...args);
    const copied = this.breed(args[1], true);
    return copied;
  }

  async move() {
    const args = [this.path, ...arguments];
    if (typeof args[1] === 'function') args[1] = args[1](this);
    await fs.move(...args);
    const moved = this.breed(args[1]);
    await Promise.all([
      this.context.load(),
      moved.load(),
    ]);
    return moved;
  }

  moveSync() {
    const args = [this.path, ...arguments];
    if (typeof args[1] === 'function') args[1] = args[1](this);
    fs.moveSync(...args);
    const moved = this.breed(args[1], true);
    this.context.load(true);
    return moved;
  }

  async rename() {
    const args = [this.path, ...arguments];
    if (typeof args[1] === 'function') args[1] = args[1](this);
    const newName = args[1];
    const dest = this.createRenamedPath(newName);
    args[1] = dest;
    await fs.rename(...args);
    await this.context.load();
    const renamedEntry = this.context.find(entry => entry.path === dest);
    if (renamedEntry) return renamedEntry.context;
    const renamed = this.breed(dest);
    await renamed.load();
    return renamed;
  }

  renameSync() {
    const args = [this.path, ...arguments];
    if (typeof args[1] === 'function') args[1] = args[1](this);
    const newName = args[1];
    const dest = this.createRenamedPath(newName);
    args[1] = dest;
    fs.renameSync(...args);
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

  writeText(...args) {
    return this.writeFile(...args);
  }

  writeTextSync(...args) {
    return this.writeFileSync(...args);
  }

  async writeJson(...args) {
    const result = await fs.writeJson(this.path, ...args);
    await this.context.load(false, [this]);
    return result;
  }

  writeJsonSync(...args) {
    const result = fs.writeJsonSync(this.path, ...args);
    this.context.load(true, [this]);
    return result;
  }

  writeJSON(...args) {
    return this.writeJSON(...args);
  }

  writeJSONSync(...args) {
    return this.writeJSONSync(...args);
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

  async writeYaml(json, options) {
    const args = this.constructor.createWriteYamlArgs(options);
    const text = yaml[args.handlerName](json, args.options);
    const result = await this.writeText(text);
    return result;
  }

  writeYamlSync(json, options) {
    const args = this.constructor.createWriteYamlArgs(options);
    const text = yaml[args.handlerName](json, args.options);
    const result = this.writeTextSync(text);
    return result;
  }
}

module.exports = Entry;