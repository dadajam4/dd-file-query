module.exports = function() {
  myDescribe('削除', function() {
    it('非同期', async function() {
      const entries = fq.sync(WORK_PATH, {r: true});
      await entries.del();
      assert.strictEqual(entries.length, 0);
    });

    it('同期', function() {
      const entries = fq.sync(WORK_PATH, {r: true});
      entries.delSync();
      assert.strictEqual(entries.length, 0);
    });
  });
}