module.exports = class TreeSource {
  constructor({
    path,
    depth,
    absolutePath,
    parent,
    children,
    entry,
  }, parentSource, rootSource) {
    this.path = path;
    this.depth = depth;
    this.absolutePath = absolutePath;
    this.parent = parentSource;
    this.entry = entry;
    this.root = rootSource || this;

    if (children) {
      this.children = [];
      for (const _child of children) {
        this.children.push(new this.constructor(_child, this, this.root));
      }
    }
  }

  get dirname() { return this.entry.dirname }
  get ext() { return this.entry.ext }
  get extname() { return this.entry.extname }
  get name() { return this.entry.name }
  get basename() { return this.entry.basename }
  get size() { return this.entry.size }
  get atime() { return this.entry.atime }
  get btime() { return this.entry.btime }
  get ctime() { return this.entry.ctime }
  get birthtime() { return this.entry.birthtime }
  get isDir() { return this.entry.isDir }
  get isFile() { return this.entry.isFile }
  get isSocket() { return this.entry.isSocket }
  get length() { return this.children && this.children.length }
  get index() { return this.parent ? this.parent.children.indexOf(this) : 0 }
  get isLastChild() { return this.parent ? this.parent.length - 1 === this.index : false }

  toJSON() {
    const json = {
      path: this.path,
      depth: this.depth,
      absolutePath: this.absolutePath,
      dirname: this.dirname,
      ext: this.ext,
      extname: this.extname,
      name: this.name,
      basename: this.basename,
      size: this.size,
      atime: this.atime,
      btime: this.btime,
      ctime: this.ctime,
      birthtime: this.birthtime,
      isDir: this.isDir,
      isFile: this.isFile,
      isSocket: this.isSocket,
    };

    if (this.children) {
      json.children = this.children.map(child => child.toJSON());
    }

    return json;
  }

  toString({
    fullBasePath = true,
    loopChar = '├',
    lastChar = '└',
    fillChar = '│',
    fillIndentChar = ' ',
    indentChar = '─',
    spaceChar = ' ',
    indentSize = 2,
    indentStr,
    loopPrefix,
    lastPrefix,
    fillPrefix,
  } = {}, prefix = '', absoluteDepth = 0) {
    indentStr = indentStr || (indentChar.repeat(indentSize));
    loopPrefix = loopPrefix || (loopChar + indentStr + spaceChar);
    lastPrefix = lastPrefix || (lastChar + indentStr + spaceChar);
    fillPrefix = fillPrefix || (fillChar + fillIndentChar.repeat(indentSize) + spaceChar);

    if (this.isLastChild) fillPrefix = fillIndentChar.repeat(indentSize + 1) + spaceChar;

    const rows = [prefix + (fullBasePath && absoluteDepth === 0 ? this.path : this.basename)];
    if (this.children) {
      for (let i = 0, l = this.children.length; i < l; i++) {
        const child = this.children[i];
        const myFill = fillPrefix.repeat(absoluteDepth);
        const childPrefix = myFill + (i === l - 1 ? lastPrefix : loopPrefix);
        rows.push(child.toString({
          indentStr,
          loopPrefix,
          lastPrefix,
          fillPrefix,
        }, childPrefix, absoluteDepth + 1));
      }
    }
    return rows.join('\n');
  }
}
