module.exports = function() {
  myDescribe('コピー', function() {
    {
      const src = path.join(WORK_PATH, 'dir1');
      const dest = path.join(WORK_PATH, '_worked');
      const matchCount = 4;
      it('非同期', async function() {
        const worked = await fq.copy(src, dest);
        assert.strictEqual(worked.path, dest);
        const children = await worked.list('*');
        assert.strictEqual(children.length, matchCount);
      });

      it('同期', function() {
        const worked = fq.copySync(src, dest);
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
        const worked = await fq.copyAll(src, dest);
        const srcEntries = fq(src, { r: true });
        const destEntries = fq(dest, { r: true });
        await Promise.all([srcEntries.load(), destEntries.load()]);
        assert.deepStrictEqual(srcEntries.length, destEntries.length);
      });

      it('All - 同期', function() {
        const worked = fq.copyAllSync(src, dest);
        const srcEntries = fq.sync(src, { r: true });
        const destEntries = fq.sync(dest, { r: true });
        assert.deepStrictEqual(srcEntries.length, destEntries.length);
      });
    }
  });
}