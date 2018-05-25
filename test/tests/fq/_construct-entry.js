module.exports = function() {
  myDescribe('Entry インスタンスを取得する時', function() {
    it('.singleメソッド利用時に、先頭のEntryインスタンスを返却する （非同期）', async function() {
      const entry = await fq.single(WORK_PATH);
      assert.strictEqual(entry.path, WORK_PATH);
    });

    it('.singleSyncメソッド利用時に、先頭のEntryインスタンスを返却する （非同期）', function() {
      const entry = fq.singleSync(WORK_PATH);
      assert.strictEqual(entry.path, WORK_PATH);
    });
  });
}