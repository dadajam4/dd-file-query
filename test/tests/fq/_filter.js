module.exports = function() {
  myDescribe('グロブやメソッドでフィルタした状態でEntriesインスタンスを取得する時', function() {
    const list1 = [
      'dir1',
      'dir2',
      'file1.txt',
      'file2.txt',
      'file3.js',
      'file4',
    ].map(basename => path.join(WORK_PATH, basename));

    const list2 = [
      'dir1',
      'dir1/file1.gif',
      'dir1/file2.json',
      'dir1/file3.js',
      'dir1/file4',
      'dir2',
      'dir2/dir1',
      'dir2/file2.txt',
      'dir2/マルチバイト.yml',
      'file1.txt',
      'file2.txt',
      'file3.js',
      'file4',
    ].map(basename => path.join(WORK_PATH, basename));

    const list3 = [
      'dir1',
      'dir2',
    ].map(basename => path.join(WORK_PATH, basename));

    it(`globパターン '*' でディレクトリ直下一覧を取得できる`, function() {
      const entries = fq(path.join(WORK_PATH, '*'), true);
      assert.deepStrictEqual(entries.found, list1);
      assert.strictEqual(entries.length, 6);
    });

    it(`globパターン '**/*' でディレクトリ以下を再帰的に全て取得できる`, function() {
      const entries = fq(path.join(WORK_PATH, '**/*'), true);
      assert.strictEqual(entries.length, 13);
      assert.deepStrictEqual(entries.found, list2);
    });

    it('list() でディレクトリ直下一覧を取得できる', async function() {
      const entries = fq.list(WORK_PATH);
      await entries.load();
      assert.strictEqual(entries.length, 6);
      assert.deepStrictEqual(entries.found, list1);
    });

    it('listSync() でディレクトリ直下一覧を同期的に取得できる', function() {
      const entries = fq.listSync(WORK_PATH);
      assert.deepStrictEqual(entries.found, list1);
      assert.strictEqual(entries.length, 6);
    });

    it('dir() で直下のディレクトリだけを全て取得できる', async function() {
      const dirs = fq.dir(WORK_PATH);
      await dirs.load();
      assert.strictEqual(dirs.length, 2);
      assert.deepStrictEqual(dirs.found, list3);
    });

    it('dirSync() で直下のディレクトリだけを同期的に全て取得できる', function() {
      const dirs = fq.dirSync(WORK_PATH);
      assert.strictEqual(dirs.length, 2);
      assert.deepStrictEqual(dirs.found, list3);
    });

    it('dir() と、オプション { recursive: true } で再帰的にディレクトリを全て取得できる', async function() {
      const dirs = fq.dir(WORK_PATH, { recursive: true });
      await dirs.load();
      assert.strictEqual(dirs.length, 3);
    });

    it('file() で直下のファイルだけを全て取得できる', async function() {
      const files = fq.file(WORK_PATH);
      await files.load();
      assert.strictEqual(files.length, 4);
    });

    it('fileSync() で直下のファイルだけを同期的に全て取得できる', function() {
      const files = fq.fileSync(WORK_PATH);
      assert.strictEqual(files.length, 4);
    });

    it('file() と、オプション { r: true } で再帰的にファイルを全て取得できる', async function() {
      const files = fq.file(WORK_PATH, { r: true });
      await files.load();
      assert.strictEqual(files.length, 10);
    });

    it(`globパターン '**/*'、 オプション { filter: entry => {...} } で数字の1がファイル名につくもののみをフィルタできる`, function() {
      const testRe = /1/;
      const entries = fq.sync(path.join(WORK_PATH, '**/*'), {
        filters: entry => testRe.test(entry.name),
      });
      assert.strictEqual(entries.length, 4);
    });
  });
}