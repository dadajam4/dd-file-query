module.exports = function() {
  myDescribe('コピー', function() {
    it('非同期', async function() {
      const entries = fq.dir(WORK_PATH);
      await entries.load();
      const checkers = [];
      for (let i = 0, l = entries.length; i < l; i++) {
        const entry = entries.get(i);
        checkers.push({
          src: entry.path,
          dest: path.join(entry.dirname, entry.name + '_worked'),
          children: await entry.list('*'),
        })
      }
      const results = await entries.copy(entry => path.join(entry.dirname, entry.name + '_worked'));
      for (let i = 0, l = results.length; i < l; i++) {
        const checker = checkers[i];
        const worked = results[i];
        assert.strictEqual(worked.path, checker.dest);
        const children = await worked.list('*');
        assert.strictEqual(children.length, checker.children.length);
      }
    });

    it('同期', function() {
      const entries = fq.dirSync(WORK_PATH);
      const checkers = [];
      for (let i = 0, l = entries.length; i < l; i++) {
        const entry = entries.get(i);
        checkers.push({
          src: entry.path,
          dest: path.join(entry.dirname, entry.name + '_worked'),
          children: entry.listSync('*'),
        })
      }
      const results = entries.copySync(entry => path.join(entry.dirname, entry.name + '_worked'));
      for (let i = 0, l = results.length; i < l; i++) {
        const checker = checkers[i];
        const worked = results[i];
        assert.strictEqual(worked.path, checker.dest);
        const children = worked.listSync('*');
        assert.strictEqual(children.length, checker.children.length);
      }
    });
  });
}