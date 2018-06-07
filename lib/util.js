const util = {
  fs: require('fs-extra'),
  glob: require('glob'),
  'parse-filepath': require('parse-filepath'),
  'js-yaml': require('js-yaml'),
  'file-type': require('file-type'),
  archiver: require('archiver'),
  decompress: require('decompress'),
  'iconv-lite': require('iconv-lite'),
  chardet: require('chardet'),
  chokidar: require('chokidar'),
};

util.parseFilepath = util['parse-filepath'];
util.yaml = util['js-yaml'];
util.fileType = util['file-type'];
util.iconv = util['iconv-lite'];

module.exports = util;