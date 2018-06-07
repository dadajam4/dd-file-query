module.exports = function() {
  myDescribe('check', function() {

    // pathExists
    it('pathExists() でファイル or ディレクトリの存在を確認できる', async function() {
      const f1 = await fq.pathExists(path.join(WORK_PATH, 'file1.txt'));
      const f2 = await fq.pathExists(path.join(WORK_PATH, 'dir1'));
      const f3 = await fq.pathExists(path.join(WORK_PATH, 'xxx.abc'));
      assert.strictEqual(f1, true);
      assert.strictEqual(f2, true);
      assert.strictEqual(f3, false);
    });

    it('pathExistsSync() でファイル or ディレクトリの存在を同期的に確認できる', function() {
      const f1 = fq.pathExistsSync(path.join(WORK_PATH, 'file1.txt'));
      const f2 = fq.pathExistsSync(path.join(WORK_PATH, 'dir1'));
      const f3 = fq.pathExistsSync(path.join(WORK_PATH, 'xxx.abc'));
      assert.strictEqual(f1, true);
      assert.strictEqual(f2, true);
      assert.strictEqual(f3, false);
    });

    // pathNotExists
    it('pathNotExists() でファイル or ディレクトリが存在しない事を確認できる', async function() {
      const f1 = await fq.pathNotExists(path.join(WORK_PATH, 'file1.txt'));
      const f2 = await fq.pathNotExists(path.join(WORK_PATH, 'dir1'));
      const f3 = await fq.pathNotExists(path.join(WORK_PATH, 'xxx.abc'));
      assert.strictEqual(f1, false);
      assert.strictEqual(f2, false);
      assert.strictEqual(f3, true);
    });

    it('pathNotExistsSync() でファイル or ディレクトリが存在しない事を同期的に確認できる', function() {
      const f1 = fq.pathNotExistsSync(path.join(WORK_PATH, 'file1.txt'));
      const f2 = fq.pathNotExistsSync(path.join(WORK_PATH, 'dir1'));
      const f3 = fq.pathNotExistsSync(path.join(WORK_PATH, 'xxx.abc'));
      assert.strictEqual(f1, false);
      assert.strictEqual(f2, false);
      assert.strictEqual(f3, true);
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

    // createSafePath
    {
      const src = path.join(WORK_PATH, 'file1.txt');
      const srcMissing = path.join(WORK_PATH, 'xxxxx.txt');
      const match1 = path.join(WORK_PATH, 'file1_1.txt');
      const match2 = path.join(WORK_PATH, 'file1-r1.txt');
      const match3 = path.join(WORK_PATH, 'file1_1v.txt');
      const match4 = path.join(WORK_PATH, 'file1-r2.txt');
      it('createSafePath() で重複しないユニークなパスを生成できる', async function() {
        const dest1 = await fq.createSafePath(src);
        const dest2 = await fq.createSafePath(src, { prefix: '-r' });
        const dest3 = await fq.createSafePath(src, { suffix: 'v' });
        const dest4 = await fq.createSafePath(src, { prefix: '-r', start: 2 });
        const dest5 = await fq.createSafePath(srcMissing);
        assert.strictEqual(dest1, match1);
        assert.strictEqual(dest2, match2);
        assert.strictEqual(dest3, match3);
        assert.strictEqual(dest4, match4);
        assert.strictEqual(dest5, srcMissing);
      });

      it('createSafePathSync() で重複しないユニークなパスを同期的に生成できる', function() {
        const dest1 = fq.createSafePathSync(src);
        const dest2 = fq.createSafePathSync(src, { prefix: '-r' });
        const dest3 = fq.createSafePathSync(src, { suffix: 'v' });
        const dest4 = fq.createSafePathSync(src, { prefix: '-r', start: 2 });
        const dest5 = fq.createSafePathSync(srcMissing);
        assert.strictEqual(dest1, match1);
        assert.strictEqual(dest2, match2);
        assert.strictEqual(dest3, match3);
        assert.strictEqual(dest4, match4);
        assert.strictEqual(dest5, srcMissing);
      });
    }

    // emptyDir
    {
      const src1 = path.join(WORK_PATH, 'tttt');
      const src2 = path.join(WORK_PATH, 'dir1');
      it('emptyDir() でディレクトリが空の状態で存在する事を保証できる', async function() {
        const worked1 = await fq.emptyDir(src1);
        const worked2 = await fq.emptyDir(src2);
        const list1 = await worked1.list();
        const list2 = await worked2.list();
        assert.deepStrictEqual(list1.found, []);
        assert.deepStrictEqual(list2.found, []);
        assert.strictEqual(worked1.isDir, true);
        assert.strictEqual(worked2.isDir, true);
      });
      it('ensureDirSync() でディレクトリが空の状態で存在する事を同期的に保証できる', function() {
        const worked1 = fq.emptyDirSync(src1);
        const worked2 = fq.emptyDirSync(src2);
        const list1 = worked1.listSync();
        const list2 = worked2.listSync();
        assert.deepStrictEqual(list1.found, []);
        assert.deepStrictEqual(list2.found, []);
        assert.strictEqual(worked1.isDir, true);
        assert.strictEqual(worked2.isDir, true);
      });
    }

    // ensureDir
    {
      const src = path.join(WORK_PATH, 'tttt');
      it('ensureDir() でディレクトリの存在を保証できる', async function() {
        const worked = await fq.ensureDir(src);
        assert.strictEqual(worked.path, src);
        assert.strictEqual(worked.isDir, true);
      });
      it('ensureDirSync() でディレクトリの存在を同期的に保証できる', function() {
        const worked = fq.ensureDirSync(src);
        assert.strictEqual(worked.path, src);
        assert.strictEqual(worked.isDir, true);
      });
    }

    // ensureDir
    {
      const src = path.join(WORK_PATH, 'tttt.txt');
      it('ensureFile() でディレクトリの存在を保証できる', async function() {
        const worked = await fq.ensureFile(src);
        assert.strictEqual(worked.path, src);
        assert.strictEqual(worked.isFile, true);
      });
      it('ensureFileSync() でディレクトリの存在を同期的に保証できる', function() {
        const worked = fq.ensureFileSync(src);
        assert.strictEqual(worked.path, src);
        assert.strictEqual(worked.isFile, true);
      });
    }
  });

  myDescribe('文字コード', { data: 2 }, function() {
    const target = path.join(WORK_PATH, 'sjis.txt');
    it('テキスト', async function() {
      const encoding = await fq.detectEncoding(target);
      assert.strictEqual(encoding, 'Shift-JIS');
    });

    it('テキスト 同期', function() {
      const encoding = fq.detectEncodingSync(target);
      assert.strictEqual(encoding, 'Shift-JIS');
    });
  });
}