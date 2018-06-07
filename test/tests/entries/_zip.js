module.exports = function() {
  myDescribe('zip & unzip', function() {
    it('ファイル パス指定なし', async function() {
      const dir = WORK_PATH;
      const target = 'file1';
      const ext = '.txt';
      const targetFilename = target + ext;
      const src = path.join(dir, targetFilename);
      const zipedDest = path.join(dir, target + '.zip');
      const unzipedDest = path.join(dir, target);
      const entries = await fq.load(src);
      const ziped = await entries.zip();
      assert.strictEqual(ziped.path, zipedDest);
      const unziped = await ziped.unzip();
      const unzipedFile = await unziped.list(targetFilename);
      assert.strictEqual(unziped.path, unzipedDest);
      assert.strictEqual(entries.size, unzipedFile.size);
    });

    it('ファイル パス指定あり', async function() {
      const dir = WORK_PATH;
      const target = 'file1';
      const ext = '.txt';
      const targetFilename = target + ext;
      const src = path.join(dir, targetFilename);
      const zipedDest = path.join(dir, 'ziped.zip');
      const unzipedDest = path.join(dir, 'unziped');
      const entries = await fq.load(src);
      const ziped = await entries.zip(zipedDest);
      assert.strictEqual(ziped.path, zipedDest);
      const unziped = await ziped.unzip(unzipedDest);
      const unzipedFile = await unziped.list(targetFilename);
      assert.strictEqual(unziped.path, unzipedDest);
      assert.strictEqual(entries.size, unzipedFile.size);
    });

    it('ディレクトリ パス指定なし', async function() {
      const dir = WORK_PATH;
      const target = 'dir1';
      const src = path.join(dir, target);
      const zipedDest = path.join(dir, target + '.zip');
      const unzipedDest = src + '_1';
      const entries = await fq.load(src);
      const ziped = await entries.zip();
      assert.strictEqual(ziped.path, zipedDest);
      const unziped = await ziped.unzip();
      assert.strictEqual(unziped.path, unzipedDest);
      assert.strictEqual(entries.size, unziped.size);
    });

    it('ディレクトリ パス指定あり', async function() {
      const dir = WORK_PATH;
      const target = 'dir1';
      const src = path.join(dir, target);
      const zipedDest = path.join(dir, 'ziped.zip');
      const unzipedDest = path.join(dir, 'unziped');
      const entries = await fq.load(src);
      const ziped = await entries.zip(zipedDest);
      assert.strictEqual(ziped.path, zipedDest);
      const unziped = await ziped.unzip(unzipedDest);
      assert.strictEqual(unziped.path, unzipedDest);
      assert.strictEqual(entries.size, unziped.size);
    });

    it('All', async function() {
      const src1 = path.join(WORK_PATH, 'dir1');
      const src2 = path.join(WORK_PATH, 'dir2');
      const dest1 = src1 + '.zip';
      const dest2 = src2 + '.zip';
      const entries = await fq.load('{' + [src1, src2].join(',') + '}');
      const [worked1, worked2] = await entries.zipAll();
      assert.strictEqual(worked1.path, dest1);
      assert.strictEqual(worked2.path, dest2);
      const zipedEntries = await fq.load('{' + [dest1, dest2].join(',') + '}');
      const [unziped1, unziped2] = await zipedEntries.unzipAll();
      assert.strictEqual(unziped1.path, src1 + '_1');
      assert.strictEqual(unziped2.path, src2 + '_1');
    });
  });
}