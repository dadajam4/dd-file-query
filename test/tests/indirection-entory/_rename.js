module.exports = function() {
  myDescribe('リネーム', function() {
    it('非同期', async function() {
      const entries = fq.dir(WORK_PATH);
      await entries.load();
      const checkers = [];
      for (let i = 0, l = entries.length; i < l; i++) {
        const entry = entries.get(i);
        const newName = entry.name + '_worked';
        const dest = entry.createRenamedPath(newName);
        checkers.push({
          src: entry.path,
          newName,
          dest,
          children: await entry.list('*'),
        })
      }
      const results = await entries.rename(entry => entry.name + '_worked');
      for (let i = 0, l = results.length; i < l; i++) {
        const checker = checkers[i];
        const worked = results[i].get(i);
        assert.strictEqual(worked.path, checker.dest);
        const children = await worked.list('*');
        assert.strictEqual(children.length, checker.children.length);
        assert.strictEqual(entries.found.includes(checker.src), false);
      }
    });

    it('同期', function() {
      const entries = fq.dirSync(WORK_PATH);
      const checkers = [];
      for (let i = 0, l = entries.length; i < l; i++) {
        const entry = entries.get(i);
        const newName = entry.name + '_worked';
        const dest = entry.createRenamedPath(newName);
        checkers.push({
          src: entry.path,
          newName,
          dest,
          children: entry.listSync('*'),
        })
      }
      const results = entries.renameSync(entry => entry.name + '_worked');
      for (let i = 0, l = results.length; i < l; i++) {
        const checker = checkers[i];
        const worked = results[i].get(i);
        assert.strictEqual(worked.path, checker.dest);
        const children = worked.listSync('*');
        assert.strictEqual(children.length, checker.children.length);
        assert.strictEqual(entries.found.includes(checker.src), false);
      }
    });
  });
}