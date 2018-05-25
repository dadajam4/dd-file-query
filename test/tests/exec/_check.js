module.exports = function() {
  const target = path.join(WORK_PATH, 'dir1/file1.gif');
  const matchData = {"ext":"gif","mime":"image/gif"};
  myDescribe('チェック', function() {
    it('ファイル種別（非同期）', async function() {
      const entry = await fq.single(target);
      const fileType = await entry.getFileType();
      assert.deepStrictEqual(fileType, matchData);
    });

    it('ファイル種別（同期）', function() {
      const entry = fq.singleSync(target);
      const fileType = entry.getFileTypeSync();
      assert.deepStrictEqual(fileType, matchData);
    });
  });
}