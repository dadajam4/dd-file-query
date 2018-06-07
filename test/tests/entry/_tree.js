module.exports = function() {
  myDescribe('tree', function() {
    {
      const matchRootStr = WORK_PATH + '\n├── dir1\n│   ├── file1.gif\n│   ├── file2.json\n│   ├── file3.js\n│   └── file4\n├── dir2\n│   ├── dir1\n│   ├── file2.txt\n│   └── マルチバイト.yml\n├── file1.txt\n├── file2.txt\n├── file3.js\n└── file4';
      const childPath = path.join(WORK_PATH, 'dir2');
      const matchChildStr = childPath + '\n├── dir1\n├── file2.txt\n└── マルチバイト.yml';
      it('全て 非同期', async function() {
        const entry = await fq.single(WORK_PATH);
        const tree = await entry.tree();
        assert.strictEqual(matchRootStr, tree.toString());
        assert.strictEqual(matchChildStr, tree.children[1].toString());
      });

      it('全て 同期', function() {
        const entry = fq.singleSync(WORK_PATH);
        const tree = entry.treeSync();
        assert.strictEqual(matchRootStr, tree.toString());
        assert.strictEqual(matchChildStr, tree.children[1].toString());
      });
    }

    {
      const matchRootStr = WORK_PATH + '\n├── dir1\n└── dir2\n    └── dir1';
      const childPath = path.join(WORK_PATH, 'dir2');
      const matchChildStr = childPath + '\n└── dir1';
      it('ディレクトリのみ 非同期', async function() {
        const entry = await fq.single(WORK_PATH);
        const tree = await entry.tree({ dir: true });
        assert.strictEqual(matchRootStr, tree.toString());
        assert.strictEqual(matchChildStr, tree.children[1].toString());
      });

      it('ディレクトリのみ 同期', function() {
        const entry = fq.singleSync(WORK_PATH);
        const tree = entry.treeSync({ dir: true });
        assert.strictEqual(matchRootStr, tree.toString());
        assert.strictEqual(matchChildStr, tree.children[1].toString());
      });
    }
  });
}