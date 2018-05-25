module.exports = function() {
  const target = path.join(WORK_PATH, 'dir1/file1.gif');
  const matchData = {"ext":"gif","mime":"image/gif"};
  myDescribe('チェック', function() {
    it('ファイル種別（非同期）', async function() {
      const entries = await fq.load(target);
      const fileType = await entries.getFileType();
      assert.deepStrictEqual(fileType, matchData);
    });

    it('ファイル種別（同期）', function() {
      const entries = fq.sync(target);
      const fileType = entries.getFileTypeSync();
      assert.deepStrictEqual(fileType, matchData);
    });
  });
}