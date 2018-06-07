module.exports = function() {
  myDescribe('移動', function() {
    it('非同期', async function() {
      const entries = await fq.dir(WORK_PATH).load();
      const src = entries.path;
      const dest = path.join(WORK_PATH, '_worked');
      const worked = await entries.move(dest);
      assert.strictEqual(entries.found.includes(src), false);
      assert.strictEqual(worked.path, dest);
      const children = await worked.list('*');
      assert.strictEqual(children.length, 4);
    });

    it('同期', function() {
      const entries = fq.dirSync(WORK_PATH);
      const src = entries.path;
      const dest = path.join(WORK_PATH, '_worked');
      const worked = entries.moveSync(dest);
      assert.strictEqual(entries.found.includes(src), false);
      assert.strictEqual(worked.path, dest);
      const children = worked.listSync('*');
      assert.strictEqual(children.length, 4);
    });


    it('All - 非同期', async function() {
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
      const results = await entries.moveAll(entry => path.join(entry.dirname, entry.name + '_worked'));
      for (let i = 0, l = results.length; i < l; i++) {
        const checker = checkers[i];
        const worked = results[i];
        assert.strictEqual(worked.path, checker.dest);
        const children = await worked.list('*');
        assert.strictEqual(children.length, checker.children.length);
        assert.strictEqual(entries.found.includes(checker.src), false);
      }
    });

    it('All - 同期', function() {
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
      const results = entries.moveAllSync(entry => path.join(entry.dirname, entry.name + '_worked'));
      for (let i = 0, l = results.length; i < l; i++) {
        const checker = checkers[i];
        const worked = results[i];
        assert.strictEqual(worked.path, checker.dest);
        const children = worked.listSync('*');
        assert.strictEqual(children.length, checker.children.length);
        assert.strictEqual(entries.found.includes(checker.src), false);
      }
    });
  });
}