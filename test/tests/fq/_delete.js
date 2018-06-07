module.exports = function() {
  myDescribe('削除', function() {
    it('非同期', async function() {
      await fq.del(WORK_PATH);
      const pathExists = await fq.pathExists(WORK_PATH);
      assert.strictEqual(pathExists, false);
    });

    it('同期', function() {
      fq.delSync(WORK_PATH);
      const pathExists = fq.pathExistsSync(WORK_PATH);
      assert.strictEqual(pathExists, false);
    });

    it('All - 非同期', async function() {
      await fq.delAll(WORK_PATH);
      const pathExists = await fq.pathExists(WORK_PATH);
      assert.strictEqual(pathExists, false);
    });

    it('All - 同期', function() {
      fq.delAllSync(WORK_PATH);
      const pathExists = fq.pathExistsSync(WORK_PATH);
      assert.strictEqual(pathExists, false);
    });
  });
}