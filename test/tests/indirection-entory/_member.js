module.exports = function() {
  myDescribe('getters', function() {
    it('正常', function() {
      const target = path.join(WORK_PATH, 'file1.txt');
      const file = fq.sync(target);
      assert.strictEqual(file.path, target);
      assert.strictEqual(file.dirname, WORK_PATH);
      assert.strictEqual(file.ext, '.txt');
      assert.strictEqual(file.extname, 'txt');
      assert.strictEqual(file.name, 'file1');
      assert.strictEqual(file.basename, 'file1.txt');
      assert.strictEqual(file.isDir, false);
      assert.strictEqual(file.isFile, true);
      assert.strictEqual(file.isSocket, false);
      assert.strictEqual(file.deleted, false);
    });

    it('ファイルがない時', function() {
      const target = path.join(WORK_PATH, '__missing__.txt');
      const file = fq.sync(target);
      assert.strictEqual(file.path, undefined);
      assert.strictEqual(file.dirname, undefined);
      assert.strictEqual(file.ext, undefined);
      assert.strictEqual(file.extname, undefined);
      assert.strictEqual(file.name, undefined);
      assert.strictEqual(file.basename, undefined);
      assert.strictEqual(file.isDir, undefined);
      assert.strictEqual(file.isFile, undefined);
      assert.strictEqual(file.isSocket, undefined);
      assert.strictEqual(file.deleted, undefined);
    });
  });
}