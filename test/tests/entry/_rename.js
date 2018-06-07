module.exports = function() {
  myDescribe('リネーム', function() {
    it('非同期', async function() {
      const entries = await fq.dir(WORK_PATH).load();
      const src = entries.first.path;
      const newName = '_worked';
      const dest = entries.first.createRenamedPath(newName);
      const worked = await entries.first.rename(newName);
      assert.strictEqual(entries.found.includes(src), false);
      assert.strictEqual(worked.first.path, dest);
      const children = await worked.first.list('*');
      assert.strictEqual(children.length, 4);
    });

    it('同期', function() {
      const entries = fq.dirSync(WORK_PATH);
      const src = entries.first.path;
      const newName = '_worked';
      const dest = entries.first.createRenamedPath(newName);
      const worked = entries.first.renameSync(newName);
      assert.strictEqual(entries.found.includes(src), false);
      assert.strictEqual(worked.first.path, dest);
      const children = worked.first.listSync('*');
      assert.strictEqual(children.length, 4);
    });
  });
}