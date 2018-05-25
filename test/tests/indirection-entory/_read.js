module.exports = function() {
  myDescribe('読み込み', function() {
    const missingPath = path.join(WORK_PATH, '__missing__.test');

    // buffer
    {
      const target = path.join(WORK_PATH, 'file1.txt');
      const matchData = 'これは\nテスト\nファイルです。。';
      it('バッファー', async function() {
        const file = fq(target);
        await file.load();
        const buffer = await file.readFile();
        const text = buffer.toString();
        assert.strictEqual(buffer instanceof Buffer, true);
        assert.strictEqual(text, matchData);
      });

      it('バッファー（同期）', function() {
        const file = fq.sync(target);
        const buffer = file.readFileSync();
        const text = buffer.toString();
        assert.strictEqual(buffer instanceof Buffer, true);
        assert.strictEqual(text, matchData);
      });

      it('バッファー（ファイルがない時）', async function() {
        const file = fq(missingPath);
        await file.load();
        const buffer = await file.readFile();
        assert.strictEqual(buffer, undefined);
      });

      it('バッファー（同期&ファイルがない時）', function() {
        const file = fq.sync(missingPath);
        const buffer = file.readFileSync();
        assert.strictEqual(buffer, undefined);
      });
    }

    // test
    {
      const target = path.join(WORK_PATH, 'file1.txt');
      const matchData = 'これは\nテスト\nファイルです。。';
      it('テキスト', async function() {
        const file = fq(target);
        await file.load();
        const text = await file.readText();
        assert.strictEqual(text, matchData);
      });

      it('テキスト（同期）', function() {
        const file = fq.sync(target);
        const text = file.readTextSync();
        assert.strictEqual(text, matchData);
      });

      it('テキスト（ファイルがない時）', async function() {
        const file = fq(missingPath);
        await file.load();
        const text = await file.readText();
        assert.strictEqual(text, undefined);
      });

      it('テキスト（ファイルがない時&同期）', function() {
        const file = fq.sync(missingPath);
        const text = file.readTextSync();
        assert.strictEqual(text, undefined);
      });
    }

    // json
    {
      const target = path.join(WORK_PATH, 'dir1/file2.json');
      const matchData = {"hoge":false,"fuga":{"moge":"muga","muge":[0,10,200]}};
      it('JSON', async function() {
        const file = fq(target);
        await file.load();
        const json = await file.readJSON();
        assert.deepStrictEqual(json, matchData);
      });

      it('JSON（同期）', function() {
        const file = fq.sync(target);
        const json = file.readJSONSync();
        assert.deepStrictEqual(json, matchData);
      });

      it('JSON（ファイルがない時）', async function() {
        const file = fq(missingPath);
        await file.load();
        const json = await file.readJSON();
        assert.strictEqual(json, undefined);
      });

      it('JSON（ファイルがない時&同期）', function() {
        const file = fq.sync(missingPath);
        const json = file.readJSONSync();
        assert.strictEqual(json, undefined);
      });
    }

    // yaml
    {
      const target = path.join(WORK_PATH, 'dir2/マルチバイト.yml');
      const matchData = {"$schema":"http://json-schema.org/draft-04/hyper-schema","title":"マルチバイトyamlサンプル","description":"","type":"object","additionalProperties":false,"properties":{"videoInformation":{"type":"object","default":null,"properties":{"id":{"title":"ID","description":"IDです","type":"string"},"url":{"title":"URL","description":"URLです","type":"string"}}}}};
      it('yaml', async function() {
        const file = fq(target);
        await file.load();
        const json = await file.readYaml();
        assert.deepStrictEqual(json, matchData);
      });

      it('yaml（同期）', function() {
        const file = fq.sync(target);
        const json = file.readYamlSync();
        assert.deepStrictEqual(json, matchData);
      });

      it('yaml（ファイルがない時）', async function() {
        const file = fq(missingPath);
        await file.load();
        const json = await file.readYaml();
        assert.strictEqual(json, undefined);
      });

      it('yaml（ファイルがない時&同期）', function() {
        const file = fq.sync(missingPath);
        const json = file.readYamlSync();
        assert.strictEqual(json, undefined);
      });
    }
  });
}