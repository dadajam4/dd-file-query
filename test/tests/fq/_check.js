module.exports = function() {
  myDescribe('check', function() {

    // isExist
    it('isExist() でファイル or ディレクトリの存在を確認できる', async function() {
      const f1 = await fq.isExist(path.join(WORK_PATH, 'file1.txt'));
      const f2 = await fq.isExist(path.join(WORK_PATH, 'dir1'));
      const f3 = await fq.isExist(path.join(WORK_PATH, 'xxx.abc'));
      assert.strictEqual(f1, true);
      assert.strictEqual(f2, true);
      assert.strictEqual(f3, false);
    });

    it('isExistSync() でファイル or ディレクトリの存在を同期的に確認できる', function() {
      const f1 = fq.isExistSync(path.join(WORK_PATH, 'file1.txt'));
      const f2 = fq.isExistSync(path.join(WORK_PATH, 'dir1'));
      const f3 = fq.isExistSync(path.join(WORK_PATH, 'xxx.abc'));
      assert.strictEqual(f1, true);
      assert.strictEqual(f2, true);
      assert.strictEqual(f3, false);
    });

    // isFile
    it('isFile() でファイルの存在を確認できる', async function() {
      const f1 = await fq.isFile(path.join(WORK_PATH, 'file1.txt'));
      const f2 = await fq.isFile(path.join(WORK_PATH, 'dir1'));
      const f3 = await fq.isFile(path.join(WORK_PATH, 'xxx.abc'));
      assert.strictEqual(f1, true);
      assert.strictEqual(f2, false);
      assert.strictEqual(f3, false);
    });

    it('isFileSync() でファイルの存在を同期的に確認できる', function() {
      const f1 = fq.isFileSync(path.join(WORK_PATH, 'file1.txt'));
      const f2 = fq.isFileSync(path.join(WORK_PATH, 'dir1'));
      const f3 = fq.isFileSync(path.join(WORK_PATH, 'xxx.abc'));
      assert.strictEqual(f1, true);
      assert.strictEqual(f2, false);
      assert.strictEqual(f3, false);
    });

    // isDir
    it('isDir() でディレクトリの存在を確認できる', async function() {
      const f1 = await fq.isDir(path.join(WORK_PATH, 'file1.txt'));
      const f2 = await fq.isDir(path.join(WORK_PATH, 'dir1'));
      const f3 = await fq.isDir(path.join(WORK_PATH, 'xxx.abc'));
      assert.strictEqual(f1, false);
      assert.strictEqual(f2, true);
      assert.strictEqual(f3, false);
    });

    it('isDirSync() でディレクトリの存在を同期的に確認できる', function() {
      const f1 = fq.isDirSync(path.join(WORK_PATH, 'file1.txt'));
      const f2 = fq.isDirSync(path.join(WORK_PATH, 'dir1'));
      const f3 = fq.isDirSync(path.join(WORK_PATH, 'xxx.abc'));
      assert.strictEqual(f1, false);
      assert.strictEqual(f2, true);
      assert.strictEqual(f3, false);
    });

    // filetype
    {
      const target = path.join(WORK_PATH, 'dir1/file1.gif');
      const matchData = {"ext":"gif","mime":"image/gif"};
      it('ファイル種別（非同期）', async function() {
        const fileType = await fq.getFileType(target);
        assert.deepStrictEqual(fileType, matchData);
      });

      it('ファイル種別（同期）', function() {
        const fileType = fq.getFileTypeSync(target);
        assert.deepStrictEqual(fileType, matchData);
      });
    }
  });
}