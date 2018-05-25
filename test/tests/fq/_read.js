module.exports = function() {
  myDescribe('read', function() {
    const missingPath = path.join(WORK_PATH, '__missing__.test');

    // buffer
    {
      const target = path.join(WORK_PATH, 'file1.txt');
      const matchData = 'これは\nテスト\nファイルです。。';
      it('readFile（非同期）', async function() {
        const buffer = await fq.readFile(target);
        const text = buffer.toString();
        assert.strictEqual(buffer instanceof Buffer, true);
        assert.strictEqual(text, matchData);
      });

      it('readFile（同期）', function() {
        const buffer = fq.readFileSync(target);
        const text = buffer.toString();
        assert.strictEqual(buffer instanceof Buffer, true);
        assert.strictEqual(text, matchData);
      });

      it('readFile（ファイルがない時）', async function() {
        const buffer = await fq.readFile(missingPath);
        assert.strictEqual(buffer, undefined);
      });

      it('readFile（ファイルがない時&同期）', function() {
        const buffer = fq.readFileSync(missingPath);
        assert.strictEqual(buffer, undefined);
      });
    }

    // text
    {
      const target = path.join(WORK_PATH, 'file1.txt');
      const matchData = 'これは\nテスト\nファイルです。。';
      it('readText（非同期）', async function() {
        const text = await fq.readText(target);
        assert.strictEqual(text, matchData);
      });

      it('readText（同期）', function() {
        const text = fq.readTextSync(target);
        assert.strictEqual(text, matchData);
      });

      it('readFile（ファイルがない時）', async function() {
        const text = await fq.readText(missingPath);
        assert.strictEqual(text, undefined);
      });

      it('readFile（ファイルがない時&同期）', function() {
        const text = fq.readTextSync(missingPath);
        assert.strictEqual(text, undefined);
      });
    }

    // json
    {
      const target = path.join(WORK_PATH, 'dir1/file2.json');
      const matchData = {"hoge":false,"fuga":{"moge":"muga","muge":[0,10,200]}};
      it('readJSON（非同期）', async function() {
        const json = await fq.readJSON(target);
        assert.deepStrictEqual(json, matchData);
      });

      it('readJSON（同期）', function() {
        const json = fq.readJSONSync(target);
        assert.deepStrictEqual(json, matchData);
      });

      it('readJSON（ファイルがない時）', async function() {
        const json = await fq.readJSON(missingPath);
        assert.strictEqual(json, undefined);
      });

      it('readJSON（ファイルがない時&同期）', function() {
        const json = fq.readJSONSync(missingPath);
        assert.strictEqual(json, undefined);
      });
    }

    // yaml
    {
      const target = path.join(WORK_PATH, 'dir2/マルチバイト.yml');
      const matchData = {"$schema":"http://json-schema.org/draft-04/hyper-schema","title":"マルチバイトyamlサンプル","description":"","type":"object","additionalProperties":false,"properties":{"videoInformation":{"type":"object","default":null,"properties":{"id":{"title":"ID","description":"IDです","type":"string"},"url":{"title":"URL","description":"URLです","type":"string"}}}}};
      it('readYaml（非同期）', async function() {
        const json = await fq.readYaml(target);
        assert.deepStrictEqual(json, matchData);
      });

      it('readYaml（同期）', function() {
        const json = fq.readYamlSync(target);
        assert.deepStrictEqual(json, matchData);
      });

      it('readYaml（ファイルがない時）', async function() {
        const json = await fq.readYaml(missingPath);
        assert.strictEqual(json, undefined);
      });

      it('readYaml（ファイルがない時&同期）', function() {
        const json = fq.readYamlSync(missingPath);
        assert.strictEqual(json, undefined);
      });
    }
  });
}