module.exports = function() {
  myDescribe('リネーム', function() {

    // Single
    {
      const matchCount = 4;
      it('非同期', async function() {
        const entries = await fq.dir(WORK_PATH).load();
        const src = entries.path;
        const newName = '_worked';
        const dest = entries.createRenamedPath(newName);
        const worked = await fq.rename(src, newName);
        await entries.load();
        assert.strictEqual(entries.found.includes(src), false);
        assert.strictEqual(worked.path, dest);
        const children = await worked.list('*');
        assert.strictEqual(children.length, matchCount);
      });

      it('同期', function() {
        const entries = fq.dirSync(WORK_PATH);
        const src = entries.path;
        const newName = '_worked';
        const dest = entries.createRenamedPath(newName);
        const worked = fq.renameSync(src, newName);
        entries.load(true);
        assert.strictEqual(entries.found.includes(src), false);
        assert.strictEqual(worked.path, dest);
        const children = worked.listSync('*');
        assert.strictEqual(children.length, matchCount);
      });
    }

    // All
    {
      const src = path.join(WORK_PATH, 'dir1');
      const newName = 'dir1_worked';
      const dest = path.join(WORK_PATH, newName);

      it('All - 非同期', async function() {
        const _srcEntries = fq(src, { r: true });
        await _srcEntries.load();
        const srcEntriesLength = _srcEntries.length;
        const worked = await fq.renameAll(src, newName);
        const srcEntries = fq(src, { r: true });
        const destEntries = fq(dest, { r: true });
        await Promise.all([srcEntries.load(), destEntries.load()])
        assert.strictEqual(srcEntries.length, 0);
        assert.strictEqual(destEntries.length, srcEntriesLength);
      });

      it('All - 同期', function() {
        const _srcEntries = fq.sync(src, { r: true });
        const srcEntriesLength = _srcEntries.length;
        const worked = fq.renameAllSync(src, newName);
        const srcEntries = fq.sync(src, { r: true });
        const destEntries = fq.sync(dest, { r: true });
        assert.strictEqual(srcEntries.length, 0);
        assert.strictEqual(destEntries.length, srcEntriesLength);
      });
    }
  });
}