module.exports = function() {
  myDescribe('書き込み', function() {

    // buffer
    {
      const target = path.join(WORK_PATH, 'file1.txt');
      const writeData = '書き込み\n完了';
      const buffer = Buffer.from(writeData, 'utf-8');
      const fileSize = 19;
      it('バッファー', async function() {
        const file = await fq.single(target);
        const originSize = file.size;
        await file.writeFile(buffer);
        const result = await fq.readText(target);
        assert.strictEqual(file.size, fileSize);
        assert.strictEqual(result, writeData);
      });

      it('バッファー（同期）', function() {
        const file = fq.singleSync(target);
        const originSize = file.size;
        file.writeFileSync(buffer);
        const result = fq.readTextSync(target);
        assert.strictEqual(file.size, fileSize);
        assert.strictEqual(result, writeData);
      });
    }

    // text
    {
      const target = path.join(WORK_PATH, 'file1.txt');
      const writeData = '書き込み\n完了';
      const fileSize = 19;
      it('テキスト', async function() {
        const file = await fq.single(target);
        const originSize = file.size;
        await file.writeText(writeData);
        const result = await fq.readText(target);
        assert.strictEqual(file.size, fileSize);
        assert.strictEqual(result, writeData);
      });

      it('テキスト（同期）', function() {
        const file = fq.singleSync(target);
        const originSize = file.size;
        file.writeTextSync(writeData);
        const result = fq.readTextSync(target);
        assert.strictEqual(file.size, fileSize);
        assert.strictEqual(result, writeData);
      });
    }

    // json
    {
      const target = path.join(WORK_PATH, 'dir1/file2.json');
      const writeData = {"a":"b","c":{"d":"e","f":[true,false,0]}};
      const fileSize = 43;
      it('JSON', async function() {
        const file = await fq.single(target);
        const originSize = file.size;
        await file.writeJson(writeData);
        const result = await fq.readJSON(target);
        assert.strictEqual(file.size, fileSize);
        assert.deepStrictEqual(result, writeData);
      });

      it('JSON（同期）', function() {
        const file = fq.singleSync(target);
        const originSize = file.size;
        file.writeJsonSync(writeData);
        const result = fq.readJSONSync(target);
        assert.strictEqual(file.size, fileSize);
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
        const file = await fq.single(target);
        await file.writeYaml(writeData);
        const result = await fq.readYaml(target);
        assert.strictEqual(file.size, fileSize);
        assert.deepStrictEqual(result, writeData);
      });

      it('yaml（同期）', function() {
        const file = fq.singleSync(target);
        file.writeYamlSync(writeData);
        const result = fq.readYamlSync(target);
        assert.strictEqual(file.size, fileSize);
        assert.deepStrictEqual(result, writeData);
      });
    }
  });
}