module.exports = function() {
  myDescribe('コピー', function() {
    const src = path.join(WORK_PATH, 'dir1');
    const newName = 'dir1_worked';
    const dest = path.join(WORK_PATH, newName);

    it('非同期', async function() {
      const worked = await fq.copy(src, dest);
      const srcEntries = fq(src, { r: true });
      const destEntries = fq(dest, { r: true });
      await Promise.all([srcEntries.load(), destEntries.load()]);
      assert.deepStrictEqual(srcEntries.length, destEntries.length);
    });

    it('同期', function() {
      const worked = fq.copySync(src, dest);
      const srcEntries = fq.sync(src, { r: true });
      const destEntries = fq.sync(dest, { r: true });
      assert.deepStrictEqual(srcEntries.length, destEntries.length);
    });
  });
}