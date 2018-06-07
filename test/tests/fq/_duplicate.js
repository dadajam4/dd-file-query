module.exports = function() {
  myDescribe('複製', function() {
    const src = path.join(WORK_PATH, 'dir1');
    const match1 = path.join(WORK_PATH, 'dir1_copy_1');
    const match2 = path.join(WORK_PATH, 'dir1_copy_2');

    it('非同期', async function() {
      const entries = await fq.load(src);
      const copied1 = await fq.duplicate(src);
      const copied2 = await fq.duplicate(src);
      assert.strictEqual(copied1.path, match1);
      assert.strictEqual(copied2.path, match2);
      assert.strictEqual(copied1.size, entries.first.size);
      assert.strictEqual(copied2.size, entries.first.size);
    });

    it('同期', function() {
      const entries = fq.sync(src);
      const copied1 = fq.duplicateSync(src);
      const copied2 = fq.duplicateSync(src);
      assert.strictEqual(copied1.path, match1);
      assert.strictEqual(copied2.path, match2);
      assert.strictEqual(copied1.size, entries.first.size);
      assert.strictEqual(copied2.size, entries.first.size);
    });


    it('All - 非同期', async function() {
      const entries = await fq.load(src);
      const [copied1] = await fq.duplicateAll(src);
      const [copied2] = await fq.duplicateAll(src);
      assert.strictEqual(copied1.path, match1);
      assert.strictEqual(copied2.path, match2);
      assert.strictEqual(copied1.size, entries.size);
      assert.strictEqual(copied2.size, entries.size);
    });

    it('All - 同期', function() {
      const entries = fq.sync(src);
      const [copied1] = fq.duplicateAllSync(src);
      const [copied2] = fq.duplicateAllSync(src);
      assert.strictEqual(copied1.path, match1);
      assert.strictEqual(copied2.path, match2);
      assert.strictEqual(copied1.size, entries.size);
      assert.strictEqual(copied2.size, entries.size);
    });
  });
}