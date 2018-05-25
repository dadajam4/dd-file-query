module.exports = function() {
  myDescribe('削除', function() {
    it('非同期', async function() {
      await fq.del(WORK_PATH);
      const isExist = await fq.isExist(WORK_PATH);
      assert.strictEqual(isExist, false);
    });

    it('同期', function() {
      fq.delSync(WORK_PATH);
      const isExist = fq.isExistSync(WORK_PATH);
      assert.strictEqual(isExist, false);
    });
  });
}