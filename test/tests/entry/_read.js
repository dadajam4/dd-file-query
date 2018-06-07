module.exports = function() {
  myDescribe('読み込み', function() {

    // buffer
    {
      const target = path.join(WORK_PATH, 'file1.txt');
      const matchData = 'これは\nテスト\nファイルです。。';
      it('バッファー', async function() {
        const file = fq(target);
        await file.load();
        const buffer = await file.first.readFile();
        const text = buffer.toString();
        assert.strictEqual(buffer instanceof Buffer, true);
        assert.strictEqual(text, matchData);
      });

      it('バッファー（同期）', function() {
        const file = fq.sync(target);
        const buffer = file.first.readFileSync();
        const text = buffer.toString();
        assert.strictEqual(buffer instanceof Buffer, true);
        assert.strictEqual(text, matchData);
      });
    }

    // text
    {
      const target = path.join(WORK_PATH, 'file1.txt');
      const matchData = 'これは\nテスト\nファイルです。。';
      it('テキスト', async function() {
        const file = fq(target);
        await file.load();
        const text = await file.first.readText();
        assert.strictEqual(text, matchData);
      });

      it('テキスト（同期）', function() {
        const file = fq.sync(target);
        const text = file.first.readTextSync();
        assert.strictEqual(typeof text, 'string');
        assert.strictEqual(text, matchData);
      });
    }

    // json
    {
      const target = path.join(WORK_PATH, 'dir1/file2.json');
      const matchData = {"hoge":false,"fuga":{"moge":"muga","muge":[0,10,200]}};
      it('JSON', async function() {
        const file = fq(target);
        await file.load();
        const json = await file.first.readJSON();
        assert.deepStrictEqual(json, matchData);
      });

      it('JSON（同期）', function() {
        const file = fq.sync(target);
        const json = file.first.readJSONSync();
        assert.deepStrictEqual(json, matchData);
      });
    }

    // yaml
    {
      const target = path.join(WORK_PATH, 'dir2/マルチバイト.yml');
      const matchData = {"$schema":"http://json-schema.org/draft-04/hyper-schema","title":"マルチバイトyamlサンプル","description":"","type":"object","additionalProperties":false,"properties":{"videoInformation":{"type":"object","default":null,"properties":{"id":{"title":"ID","description":"IDです","type":"string"},"url":{"title":"URL","description":"URLです","type":"string"}}}}};
      it('yaml', async function() {
        const file = fq(target);
        await file.load();
        const json = await file.first.readYaml();
        assert.deepStrictEqual(json, matchData);
      });

      it('yaml（同期）', function() {
        const file = fq.sync(target);
        const json = file.first.readYamlSync();
        assert.deepStrictEqual(json, matchData);
      });
    }
  });

  myDescribe('読み込み（文字コード）', { data: 2 }, function() {
    const target = path.join(WORK_PATH, 'sjis.txt');
    const matchData = 'あいうえお ０１２３\nａｂｃ ＸＹＺ\nｱｲｳｴｵ ｧｨｩｪォ\n文字化けパターン\n機能・研究\n～―－＄￠￡㈱①Ⅱ';
    it('sjis', async function() {
      const entry = await fq.single(target);
      const text = await entry.readText('shift_jis');
      assert.strictEqual(text, matchData);
    });

    it('sjis 非同期', function() {
      const entry = fq.singleSync(target);
      const text = entry.readTextSync('shift_jis');
      assert.strictEqual(text, matchData);
    });
  });
}