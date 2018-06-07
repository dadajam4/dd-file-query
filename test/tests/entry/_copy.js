module.exports = function() {
  myDescribe('コピー', function() {
    it('非同期', async function() {
      const entries = await fq.dir(WORK_PATH).load();
      const dest = path.join(WORK_PATH, '_worked');
      const worked = await entries.first.copy(dest);
      assert.strictEqual(worked.path, dest);
      const children = await worked.list('*');
      assert.strictEqual(children.length, 4);
    });

    it('同期', function() {
      const entries = fq.dirSync(WORK_PATH);
      const dest = path.join(WORK_PATH, '_worked');
      const worked = entries.first.copySync(dest);
      assert.strictEqual(worked.path, dest);
      const children = worked.listSync('*');
      assert.strictEqual(children.length, 4);
    });
  });
}