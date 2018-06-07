module.exports = function() {
  const target = path.join(WORK_PATH, 'dir1/file1.gif');
  const matchData = {"ext":"gif","mime":"image/gif"};
  myDescribe('チェック', function() {
    it('ファイル種別（非同期）', async function() {
      const entry = await fq.single(target);
      const fileType = await entry.getFileType();
      assert.deepStrictEqual(fileType, matchData);
    });

    it('ファイル種別（同期）', function() {
      const entry = fq.singleSync(target);
      const fileType = entry.getFileTypeSync();
      assert.deepStrictEqual(fileType, matchData);
    });

    // emptyDir
    {
      const src = path.join(WORK_PATH, 'dir1');
      it('emptyDir() でディレクトリが空の状態で存在する事を保証できる', async function() {
        const entry = await fq.single(src);
        const worked = await entry.emptyDir();
        const list = await worked.list();
        assert.deepStrictEqual(list.found, []);
        assert.strictEqual(worked.isDir, true);
      });
      it('ensureDirSync() でディレクトリが空の状態で存在する事を同期的に保証できる', function() {
        const entry = fq.singleSync(src);
        const worked = entry.emptyDirSync();
        const list = worked.listSync();
        assert.deepStrictEqual(list.found, []);
        assert.strictEqual(worked.isDir, true);
      });
    }

    // ensureDir
    {
      const src = path.join(WORK_PATH, 'dir1');
      const name = 'tttt';
      const dest = path.join(src, name);
      it('ensureDir() でディレクトリの存在を保証できる', async function() {
        const entry = await fq.single(src);
        const worked = await entry.ensureDir(name);
        assert.strictEqual(worked.path, dest);
        assert.strictEqual(worked.isDir, true);
      });
      it('ensureDirSync() でディレクトリの存在を同期的に保証できる', function() {
        const entry = fq.singleSync(src);
        const worked = entry.ensureDirSync(name);
        assert.strictEqual(worked.path, dest);
        assert.strictEqual(worked.isDir, true);
      });
    }

    // ensureFile
    {
      const src = path.join(WORK_PATH, 'dir1');
      const name = 'tttt.txt';
      const dest = path.join(src, name);
      it('ensureFile() でファイルの存在を保証できる', async function() {
        const entry = await fq.single(src);
        const worked = await entry.ensureFile(name);
        assert.strictEqual(worked.path, dest);
        assert.strictEqual(worked.isFile, true);
      });
      it('ensureFileSync() でファイルの存在を同期的に保証できる', function() {
        const entry = fq.singleSync(src);
        const worked = entry.ensureFileSync(name);
        assert.strictEqual(worked.path, dest);
        assert.strictEqual(worked.isFile, true);
      });
    }
  });

  myDescribe('文字コード', { data: 2 }, function() {
    const target = path.join(WORK_PATH, 'sjis.txt');
    it('テキスト', async function() {
      const file = await fq.single(target);
      const encoding = await file.detectEncoding();
      assert.strictEqual(encoding, 'Shift-JIS');
    });

    it('テキスト 同期', function() {
      const file = fq.singleSync(target);
      const encoding = file.detectEncodingSync();
      assert.strictEqual(encoding, 'Shift-JIS');
    });
  });
}