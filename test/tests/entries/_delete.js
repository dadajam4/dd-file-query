module.exports = function() {
  myDescribe('削除', function() {
    it('非同期', async function() {
      const entries = await fq.load(WORK_PATH);
      await entries.del();
      assert.strictEqual(entries.length, 0);
    });

    it('同期', function() {
      const entries = fq.sync(WORK_PATH);
      entries.delSync();
      assert.strictEqual(entries.length, 0);
    });

    it('All - 非同期', async function() {
      const entries = await fq.load(WORK_PATH, {r: true});
      await entries.delAll();
      assert.strictEqual(entries.length, 0);
    });

    it('All - 同期', function() {
      const entries = fq.sync(WORK_PATH, {r: true});
      entries.delAllSync();
      assert.strictEqual(entries.length, 0);
    });
  });
}