module.exports = function() {
  myDescribe('Entries インスタンスを取得する時', function() {
    it('オプション無しでコンストラクトした時に、未ロード状態のインスタンスを返却する', function() {
      const entries = fq(WORK_PATH);
      assert.strictEqual(entries.length, 0);
      assert.strictEqual(entries.loaded, false);
      assert.deepStrictEqual(entries.found, []);
    });

    it('オプション無しでコンストラクトした際に、ロードできる', async function() {
      const entries = fq(WORK_PATH);
      await entries.load();
      assert.strictEqual(entries.length, 1);
      assert.strictEqual(entries.get(0).path, WORK_PATH);
      assert.deepStrictEqual(entries.found, [WORK_PATH]);
    });

    it('load() でload込みの状態でインスタンスを取得できる', async function() {
      const entries = await fq.load(WORK_PATH);
      assert.strictEqual(entries.length, 1);
      assert.strictEqual(entries.get(0).path, WORK_PATH);
      assert.deepStrictEqual(entries.found, [WORK_PATH]);
    });

    it('オプション指定で同期自動ロードされたインスタンスを返却する', function() {
      const entries = fq(WORK_PATH, { sync: true });
      assert.strictEqual(entries.length, 1);
      assert.strictEqual(entries.get(0).path, WORK_PATH);
      assert.deepStrictEqual(entries.found, [WORK_PATH]);
    });

    it('オプション指定がbooleanの場合 syncプロパティとして理解できる', function() {
      const entries = fq(WORK_PATH, true);
      assert.strictEqual(entries.length, 1);
      assert.strictEqual(entries.get(0).path, WORK_PATH);
      assert.deepStrictEqual(entries.found, [WORK_PATH]);
    });

    it('.syncメソッド利用時に、syncプロパティとして理解できる', function() {
      const entries = fq.sync(WORK_PATH);
      assert.strictEqual(entries.length, 1);
      assert.strictEqual(entries.get(0).path, WORK_PATH);
      assert.deepStrictEqual(entries.found, [WORK_PATH]);
    });
  });
}