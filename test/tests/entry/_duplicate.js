module.exports = function() {
  myDescribe('複製', function() {
    const src = path.join(WORK_PATH, 'dir1');
    const match1 = path.join(WORK_PATH, 'dir1_copy_1');
    const match2 = path.join(WORK_PATH, 'dir1_copy_2');
    it('非同期', async function() {
      const entry = await fq.single(src);
      const copied1 = await entry.duplicate();
      const copied2 = await entry.duplicate();
      assert.strictEqual(copied1.path, match1);
      assert.strictEqual(copied2.path, match2);
      assert.strictEqual(copied1.size, entry.size);
      assert.strictEqual(copied2.size, entry.size);
    });

    it('同期', function() {
      const entry = fq.singleSync(src);
      const copied1 = entry.duplicateSync();
      const copied2 = entry.duplicateSync();
      assert.strictEqual(copied1.path, match1);
      assert.strictEqual(copied2.path, match2);
      assert.strictEqual(copied1.size, entry.size);
      assert.strictEqual(copied2.size, entry.size);
    });
  });
}