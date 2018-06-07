module.exports = function() {
  myDescribe('削除', function() {
    it('非同期', async function() {
      const entries = fq(WORK_PATH);
      await entries.load();
      await entries.first.del();
      assert.strictEqual(entries.length, 0);
    });

    it('同期', function() {
      const entries = fq.sync(WORK_PATH);
      entries.first.delSync();
      assert.strictEqual(entries.length, 0);
    });

    it('一つ削除', function() {
      const entries = fq.listSync(WORK_PATH);
      entries.first.delSync();
      assert.strictEqual(entries.length, 5);
    });

    it('一つ削除（ディレクトリ）', function() {
      const entries = fq.listSync(WORK_PATH, {r: true});
      const target = entries.find(e => e.name === 'dir2');
      target.delSync();
      assert.strictEqual(entries.length, 9);
    });

    it('複数削除（最初にディレクトリが削除されて後続のファイル削除で失敗しない事）', async function() {
      const entries = await fq.load(WORK_PATH, {r: true});
      await Promise.all(entries.map(e => e.del()));
      assert.strictEqual(entries.length, 0);
    });
  });
}