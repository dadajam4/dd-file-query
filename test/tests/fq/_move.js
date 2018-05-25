module.exports = function() {
  myDescribe('移動', function() {
    const src = path.join(WORK_PATH, 'dir1');
    const newName = 'dir1_worked';
    const dest = path.join(WORK_PATH, newName);

    it('非同期', async function() {
      const _srcEntries = fq(src, { r: true });
      await _srcEntries.load();
      const srcEntriesLength = _srcEntries.length;
      const worked = await fq.move(src, dest);
      const srcEntries = fq(src, { r: true });
      const destEntries = fq(dest, { r: true });
      await Promise.all([srcEntries.load(), destEntries.load()])
      assert.strictEqual(srcEntries.length, 0);
      assert.strictEqual(destEntries.length, srcEntriesLength);
    });

    it('同期', function() {
      const _srcEntries = fq.sync(src, { r: true });
      const srcEntriesLength = _srcEntries.length;
      const worked = fq.moveSync(src, dest);
      const srcEntries = fq.sync(src, { r: true });
      const destEntries = fq.sync(dest, { r: true });
      assert.strictEqual(srcEntries.length, 0);
      assert.strictEqual(destEntries.length, srcEntriesLength);
    });
  });
}