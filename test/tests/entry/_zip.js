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
      const entry = await fq.single(src);
      const ziped = await entry.zip();
      assert.strictEqual(ziped.path, zipedDest);
      const unziped = await ziped.unzip();
      const unzipedFile = await unziped.list(targetFilename);
      assert.strictEqual(unziped.path, unzipedDest);
      assert.strictEqual(entry.size, unzipedFile.size);
    });

    it('ファイル パス指定あり', async function() {
      const dir = WORK_PATH;
      const target = 'file1';
      const ext = '.txt';
      const targetFilename = target + ext;
      const src = path.join(dir, targetFilename);
      const zipedDest = path.join(dir, 'ziped.zip');
      const unzipedDest = path.join(dir, 'unziped');
      const entry = await fq.single(src);
      const ziped = await entry.zip(zipedDest);
      assert.strictEqual(ziped.path, zipedDest);
      const unziped = await ziped.unzip(unzipedDest);
      const unzipedFile = await unziped.list(targetFilename);
      assert.strictEqual(unziped.path, unzipedDest);
      assert.strictEqual(entry.size, unzipedFile.size);
    });

    it('ディレクトリ パス指定なし', async function() {
      const dir = WORK_PATH;
      const target = 'dir1';
      const src = path.join(dir, target);
      const zipedDest = path.join(dir, target + '.zip');
      const unzipedDest = src + '_1';
      const entry = await fq.single(src);
      const ziped = await entry.zip();
      assert.strictEqual(ziped.path, zipedDest);
      const unziped = await ziped.unzip();
      assert.strictEqual(unziped.path, unzipedDest);
      assert.strictEqual(entry.size, unziped.size);
    });

    it('ディレクトリ パス指定あり', async function() {
      const dir = WORK_PATH;
      const target = 'dir1';
      const src = path.join(dir, target);
      const zipedDest = path.join(dir, 'ziped.zip');
      const unzipedDest = path.join(dir, 'unziped');
      const entry = await fq.single(src);
      const ziped = await entry.zip(zipedDest);
      assert.strictEqual(ziped.path, zipedDest);
      const unziped = await ziped.unzip(unzipedDest);
      assert.strictEqual(unziped.path, unzipedDest);
      assert.strictEqual(entry.size, unziped.size);
    });
  });
}