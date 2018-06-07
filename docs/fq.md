# Factory & Utility:fq
本モジュールを利用する時のエンドポインメソッドです。  
基本的にこのメソッドにglobパターンやオプションを指定して [Entries](./Entries.md) または [Entry](./Entry.md) インスタンスを取得しファイル操作を行います。  
本Factoryによって実行されるほとんどの処理は`Entries`クラスのstaticメソッドです。


Methods
----
- [Factory（ファクトリ）](#factory)
- [Utility（ユーティリティー）](#utility)

<a name="factory"></a>
### Factory（ファクトリ）
----


#### `fq(pattern[, options]) : <Entries>`
globパターンを指定して`Entries`インスタンスを取得します。  
この時点ではglob検索は行われていないためファイル参照はできません。  
取得したインスタンスの`load()`メソッドを実行する事でglob検索が行われます。  
基本的にこの呼び出しで`Entries`インスタンスの取得を行う必要はなく、  
`fq.load()`などで、ロードを同時に行う事をお勧めします。  
なんらかの事情でロードを遅延させたい時にこれを利用してください。

#### `fq.load(pattern[, options]) : <Promise> -> <Entries>`
`fq`呼び出しと同時に内部的に`load()`メソッドを実行し、ロードが完了した`Entries`インスタンスを返却します。

#### `fq.sync(pattern[, options]) : <Entries>`
`fq.load`の同期版です。

#### `fq.single(pattern[, options]) : <Promise> -> <Entry>`
`fq.load()`を実施し、ヒットした`Entries`インスタンスから先頭の`Entry`インスタンスを返却します。  
単一ファイルの取得の場合は基本的にこれを利用してください。

#### `fq.singleSync(pattern[, options]) : <Entry>`
`fq.single`の同期版です。

#### `fq.list(path[, options]) : <Promise> -> <Entries>`
指定した`path`直下の`Entry`集合を取得する時に利用します。  
`options.recursive（or r）`を`true`にすればさらに下層を再帰的に検索します。

#### `fq.listSync(path[, options]) : <Entries>`
`fq.list`の同期版です。

#### `fq.dir(path[, options]) : <Promise> -> <Entries>`
指定した`path`直下のディレクトリのみの`Entry`集合を取得する時に利用します。
`options.recursive（or r）`を`true`にすればさらに下層を再帰的に検索します。

#### `fq.dirSync(path[, options]) : <Entries>`
`fq.dir`の同期版です。

#### `fq.file(path[, options]) : <Promise> -> <Entries>`
指定した`path`直下のファイルのみの`Entry`集合を取得する時に利用します。
`options.recursive（or r）`を`true`にすればさらに下層を再帰的に検索します。

#### `fq.fileSync(path[, options]) : <Entries>`
`fq.file`の同期版です。

<a name="utility"></a>
### Utility（ユーティリティー）
----

#### `fq.pathExists(path) : <Promise> -> <Boolean>`
`path`にファイルが存在するかチェックし`Boolean`値を返却します。

#### `fq.pathExistsSync(path) : <Boolean>`
`fq.pathExists`の同期版です。

#### `fq.pathNotExists(path) : <Promise> -> <Boolean>`
`fq.pathExists`のレスポンスを逆転して返却します。

#### `fq.pathNotExistsSync(path) : <Boolean>`
`fq.pathNotExists`の同期版です。

#### `fq.createSafePath(path[, setting]) : <Promise> -> <String>`
`path`で指定したパスが存在するか確かめ、存在しない場合はそのまま返却、存在する場合はそのディレクトリ内でユニークとなるパスに変換して返却します。

- `path` `<String>` ファイルパス
- `setting` `<Object>`
	- `prefix` `<String>` `Default: '_'` ファイル名とインクリメント番号の間に挿入する文字列
	- `suffix` `<String>` `Default: ''` インクリメント番号と拡張子の間に挿入する文字列
	- `start` `<Number>` `Default: 1` インクリメント開始番号

（例）path/to/hoge.txt がすでにある場合

```js
fq.createSafePath('path/to/hoge.txt')
  .then(created => console.log(created); /* 'path/to/hoge_1.txt' */)
```

#### `fq.createSafePathSync(path[, setting]) : <String>`
`fq.createSafePath`の同期版です。



<a name="operation-with-construct"></a>
## ファイル操作＋`Entry`同時取得

以下のメソッドは全て第1引数に指定したパスに対して、`Entry`インスタンスが保有する同名のメソッドを実行し、そのインスタンスを返却します。
（メソッド名にサフィックス「Sync」を付ける事で同期処理も可能です。例:writeFileSync）  
メソッド毎のパラメータは第2引数以降に指定してください。

- emptyDir
- ensureDir
- ensureFile
- writeFile
- writeText
- writeJson
- writeJSON
- writeYaml

ファイル書き込み＆インスタンスを取得する例

```js
const entry = await fq.writeText('path/to/hoge.txt', 'Hello text!!');
```

<a name="operation-with-results"></a>
## ファイル操作＋結果同時取得

以下のメソッドは全て、第1引数で指定したglobパターンから取得される`Entries`インスタンスに対して実行され、結果をそのまま返却します。 
（メソッド名にサフィックス「Sync」を付ける事で同期処理も可能です。例:readFileAllSync)  

- readFileAll
- readTextAll
- readJsonAll
- readJSONAll
- readYamlAll
- delAll
- copyAll
- duplicateAll
- moveAll
- renameAll
- zipAll
- unzipAll
- watchAll

これらのメソッドには、第1引数にはpattern文字列ではなくオブジェクトを渡す事もできます。  
オブジェクトにした場合、以下の構造で指定可能です。

- `pattern` `<String>` globパターン文字列
- `options` `<Object>` globオプション

<a name="construct-with-ref-entry"></a>
## `Entry`ロード+メソッド実行 or プロパティ参照
以下のメソッドは全て、第1引数で指定したpathから取得される`Entry`インスタンスに対して同名のプロパティ参照、もしくはメソッドが実行された結果を返却します。

- isFile
- isDir
- isSocket
- getFileType
- detectEncoding
- del
- copy
- duplicate
- move
- rename
- readFile
- readText
- readJson
- readJSON
- readYaml
- zip
- unzip
- tree

```js
// 指定したパスがディレクトリか確認する例
const isDir = await fq.isDir('path/to/dir');

// 指定したパスのテキストをShift-JISで読み込む例
const text = await fq.readText('path/to/hoge.txt', 'Shift-JIS');
```