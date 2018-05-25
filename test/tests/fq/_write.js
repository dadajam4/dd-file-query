module.exports = function() {
  myDescribe('書き込み', function() {

    // buffer
    {
      const target = path.join(WORK_PATH, 'file1.txt');
      const writeData = '書き込み\n完了';
      const buffer = Buffer.from(writeData, 'utf-8');
      const fileSize = 19;
      it('バッファー', async function() {
        const entry = await fq.writeFile(target, buffer);
        const result = await entry.readText();
        assert.strictEqual(entry.size, fileSize);
        assert.strictEqual(result, writeData);
      });

      it('バッファー（同期）', function() {
        const entry = fq.writeFileSync(target, buffer);
        const result = entry.readTextSync();
        assert.strictEqual(entry.size, fileSize);
        assert.strictEqual(result, writeData);
      });
    }

    // text
    {
      const target = path.join(WORK_PATH, 'file1.txt');
      const writeData = '書き込み\n完了';
      const fileSize = 19;
      it('テキスト', async function() {
        const entry = await fq.writeText(target, writeData);
        const result = await entry.readText();
        assert.strictEqual(entry.size, fileSize);
        assert.strictEqual(result, writeData);
      });

      it('テキスト（同期）', function() {
        const entry = fq.writeTextSync(target, writeData);
        const result = entry.readTextSync();
        assert.strictEqual(entry.size, fileSize);
        assert.strictEqual(result, writeData);
      });
    }

    // json
    {
      const target = path.join(WORK_PATH, 'dir1/file2.json');
      const writeData = {"a":"b","c":{"d":"e","f":[true,false,0]}};
      const fileSize = 43;
      it('JSON', async function() {
        const entry = await fq.writeJson(target, writeData);
        const result = await entry.readJson();
        assert.strictEqual(entry.size, fileSize);
        assert.deepStrictEqual(result, writeData);
      });

      it('JSON（同期）', function() {
        const entry = fq.writeJsonSync(target, writeData);
        const result = entry.readJsonSync();
        assert.strictEqual(entry.size, fileSize);
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
        const entry = await fq.writeYaml(target, writeData);
        const result = await entry.readYaml();
        assert.strictEqual(entry.size, fileSize);
        assert.deepStrictEqual(result, writeData);
      });

      it('yaml（同期）', function() {
        const entry = fq.writeYamlSync(target, writeData);
        const result = entry.readYamlSync();
        assert.strictEqual(entry.size, fileSize);
        assert.deepStrictEqual(result, writeData);
      });
    }
  });
}