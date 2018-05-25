module.exports = function() {
  myDescribe('書き込み', function() {

    // buffer
    {
      const target = path.join(WORK_PATH, 'file1.txt');
      const writeData = '書き込み\n完了';
      const buffer = Buffer.from(writeData, 'utf-8');
      const fileSize = 19;
      it('バッファー', async function() {
        const entries = await fq.load(target);
        const originSize = entries.size;
        await entries.writeFile(buffer);
        const result = await fq.readText(target);
        assert.strictEqual(entries.size, fileSize);
        assert.strictEqual(result, writeData);
      });

      it('バッファー（同期）', function() {
        const entries = fq.sync(target);
        const originSize = entries.size;
        entries.writeFileSync(buffer);
        const result = fq.readTextSync(target);
        assert.strictEqual(entries.size, fileSize);
        assert.strictEqual(result, writeData);
      });
    }

    // text
    {
      const target = path.join(WORK_PATH, 'file1.txt');
      const writeData = '書き込み\n完了';
      const fileSize = 19;
      it('テキスト', async function() {
        const entries = await fq.load(target);
        const originSize = entries.size;
        await entries.writeText(writeData);
        const result = await fq.readText(target);
        assert.strictEqual(entries.size, fileSize);
        assert.strictEqual(result, writeData);
      });

      it('テキスト（同期）', function() {
        const entries = fq.sync(target);
        const originSize = entries.size;
        entries.writeTextSync(writeData);
        const result = fq.readTextSync(target);
        assert.strictEqual(entries.size, fileSize);
        assert.strictEqual(result, writeData);
      });
    }

    // json
    {
      const target = path.join(WORK_PATH, 'dir1/file2.json');
      const writeData = {"a":"b","c":{"d":"e","f":[true,false,0]}};
      const fileSize = 43;
      it('JSON', async function() {
        const entries = await fq.load(target);
        const originSize = entries.size;
        await entries.writeJson(writeData);
        const result = await fq.readJSON(target);
        assert.strictEqual(entries.size, fileSize);
        assert.deepStrictEqual(result, writeData);
      });

      it('JSON（同期）', function() {
        const entries = fq.sync(target);
        const originSize = entries.size;
        entries.writeJsonSync(writeData);
        const result = fq.readJSONSync(target);
        assert.strictEqual(entries.size, fileSize);
        assert.deepStrictEqual(result, writeData);
      });
    }

    // yaml
    {
      const target = path.join(WORK_PATH, 'dir2/マルチバイト.yml');
      const writeData = {"a":"b","c":{"d":"e","f":[true,false,0]}};
      const fileSize = 51;
      const matchData = `a: b
c:
  d: e
  f:
    - true
    - false
    - 0
`;
      it('yaml', async function() {
        const entries = await fq.load(target);
        await entries.writeYaml(writeData);
        const result = await fq.readYaml(target);
        assert.strictEqual(entries.size, fileSize);
        assert.deepStrictEqual(result, writeData);
      });

      it('yaml（同期）', function() {
        const entries = fq.sync(target);
        entries.writeYamlSync(writeData);
        const result = fq.readYamlSync(target);
        assert.strictEqual(entries.size, fileSize);
        assert.deepStrictEqual(result, writeData);
      });
    }
  });
}