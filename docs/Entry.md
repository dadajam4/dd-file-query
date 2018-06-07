# Class:Entry
glob検索でヒットしたパスの1つから生成されるファイル、及びディレクトリエントリーです。  
ファイルやディレクトリの操作は基本的にこのインスタンスに対して行います。 
しかし、自身のインスタンスがcontextの0番目の要素である時に限り、ほぼ全てのプロパティ、メソッドは親エントリーから同名で参照可能です。  
詳細は[暗黙的なEntry参照について](./Entries.md#ref-first-entry)を参照してください。

Properties
----
- `path` `<String>` フルパス
- `context` `Entries` 検索元となる`Entries`インスタンス
- `excludeExtPath` `<String>` フルパスから拡張子を除いた文字列
- `dirname` `<String>` 自身が格納されているディレクトリフルパス
- `ext` `<String>` 拡張子（ドット「.」）含む
- `extname` `<String>` 拡張子（ドット「.」）を含まない
- `name` `<String>` ファイル名（拡張子を含まない）
- `basename` `<String>` ファイル名（拡張子を含む）
- `deleted` `<Boolean>` 削除済みのエントリーか否か
- `stats` `<Stats>` [fs.Stats インスタンス](https://nodejs.org/api/fs.html#fs_class_fs_stats)
- `size` `<Number>` ファイルサイズ
- `isDir` `<Boolean>` trueの場合ディレクトリ
- `isFile` `<Boolean>` trueの場合ファイル
- `isSocket` `<Boolean>` trueの場合ソケット
- `atime` `<String>` atime
- `btime` `<String>` btime
- `ctime` `<String>` ctime
- `birthtime` `<String>` birthtime
- `watcher` `Object` watch中のみ `chokidar` watcher

Methods
----
- [Utility（ユーティリティー）](#utility)
- [Operation（操作）](#operation)
- [Read（読み込み）](#read)
- [Write（書き込み）](#write)
- [Watch（監視）](#watch)


<a name="utility"></a>
### Utility（ユーティリティー）
----

#### `getExtReplacedBasename(ext) : <String>`
自身のファイル名から拡張子を置き換えた文字列を返却します

- `ext` `String` 置き換える拡張子

#### `getExtReplacedPath(ext) : <String>`
自身のフルパスから拡張子を置き換えた文字列を返却します

- `ext` `<String>` 置き換える拡張子

#### `createRenamedPath(newName) : <String>`
自身のフルパスからファイル名を置き換えた文字列を返却します

- `newName` `<String>` 置き換えるファイル名

#### `getFileType() : <Promise> -> <Object>`
自身のファイルタイプ（MIME）を取得します。
[see](https://www.npmjs.com/package/file-type)

#### `getFileTypeSync() : <Object>`
`getFileType` の同期版です。

#### `detectEncoding([options]) : <Promise> -> <Object>`
自身のパスファイルの文字エンコーディングを検出します。  
戻り値、オプションは[chardet](https://www.npmjs.com/package/chardet)を参照してください。

#### `detectEncodingSync([options]) : <Object>`
`detectEncoding` の同期版です。

#### `getDuplicatePath([{ dest = this.path, prefix = '_copy_', start } = {}, isSync = false]) : [<Promise> ->] <String>`

自身のパスを複製する事ができるユニークなパス文字列を取得する。

#### `emptyDir(name = '') : <Promise> -> <Entry>`
自身のパス＋`name`のディレクトリが空で、かつ存在する事を保証し、その`Entry`インスタンスを返却します。  

#### `emptyDirSync() : <Entry>`
`emptyDir` の同期版です。

#### `ensureDir(name = '') : <Promise> -> <Entry>`
自身のパス＋`name`のディレクトリが存在する事を保証し、その`Entry`インスタンスを返却します。  

#### `ensureDirSync(name = '') : <Entry>`
`ensureDir` の同期版です。

#### `ensureFile(name = '') : <Promise> -> <Entry>`
自身のパス＋`name`のファイルが存在する事を保証し、その`Entry`インスタンスを返却します。  

#### `ensureFileSync(name = '') : <Entry>`
`ensureFile` の同期版です。


- `dest` `<String | Function(this)>` 複製しようとしているファイル名、もしくはそれを返却する関数
- `prefix` `<String>` ファイル名重複回避時のプレフィックス文字列
- `start` `<Number>` ファイル名重複回避時のインデックス開始番号
- `isSync` `<Boolean>` trueで同期処理を行う。falseでPromiseインスタンスを返却する

#### `list([pattern = '*', options]) : <Promise> -> <Entries>`

- `pattern` `<String>` 自身のパスに連結するglobパターンです
- `options` `<Object>` fqファクトリのoptions参照

自身のパスの直下からglob検索を行い、ロード済みのEntriesインスタンスを返却します。  
※このメソッドはディレクトリに対して行わないと意味がありません。  

#### `listSync([pattern = '*', options]) : <Entries>`
`list` の同期版です。

#### `tree([setting]) : <Promise> -> <TreeSource>`

自身のパスを再帰的に辿ってTreeSourceインスタンスを生成し返却します。

- `setting` `<Object>`
	- `depth` `<Number>` `Default: null` 深さを指定します
	- `dir` `<Boolean>` `Default: false` ディレクトリのみを探索する場合trueに設定します 

#### `treeSync([setting]) : <TreeSource>`
`treeSync` の同期版です。



<a name="operation"></a>
### Operation（操作）
----

#### `del() : <Promise> -> void`
自身のパスを削除して、親コンテキストを更新します。  
これにより親コンテキストのリストからは削除されますが、自身のオブジェクトはコンテキストオブジェクトを参照したままです。   
プロセス上でメモリを不必要に利用しすぎないよう、不要になった時点で全ての参照を解除し、 
GCに拾わせてください。

#### `delSync() : void`
`del` の同期版です。

#### `copy(dest[, options]) : <Promise> -> <Entry>`
自身のパスをコピーして、コピー先のエントリーインスタンスを返却します。  
パラメータは[こちら](https://github.com/jprichardson/node-fs-extra/blob/master/docs/copy.md)を参照してください。

#### `copySync(dest[, options]) : <Entry>`
`copy` の同期版です。

#### `duplicate([setting]) : <Promise> -> <Entry>`

自身のパスを複製して、複製先のエントリーインスタンスを返却します。  

- `setting` `<Object>` getDuplicatePath()の第1引数に渡すオブジェクト

#### `duplicateSync([setting]) : <Entry>`
`duplicate` の同期版です。

#### `move(dest[, options]) : <Promise> -> <Entry>`

自身のパスを移動して、親コンテキストをリロードした上で、移動先のエントリーインスタンスを返却します。  
移動先のパスが、元のコンテキストのglobパターンにマッチしない場合、元のコンテキストから削除し、新たなコンテキストとエントリーインスタンスを生成し返却します。  

- `dest` `<String | Function(this)>` 移動先パス、もしくはそれを返却する関数
- `options` `<Object>` [fs-extra - move()](https://github.com/jprichardson/node-fs-extra/blob/master/docs/move.md)を参照

#### `moveSync(dest[, options]) : <Entry>`
`move` の同期版です。

#### `rename(newName) : <Promise> -> <Entry>`
自身のファイル or ディレクトリ名を変更し、親コンテキストをリロードした上で、リネーム後のエントリーインスタンスを返却します。  
リネーム後のパスが、元のコンテキストのglobパターンにマッチしない場合、元のコンテキストから削除し、新たなコンテキストとエントリーインスタンスを生成し返却します。  
このメソッドは`fs-extra`のrenameとは異なり、引数ではファイル名のみを受け付けます。（つまりフルパスは受け付けません。）  
パスを変更する時は`move`メソッドを利用してください。

- `newName` `<String | Function(this)>` 新しい名前、もしくはそれを返却する関数

#### `renameSync(newName) : <Entry>`
`rename` の同期版です。

#### `zip(dest[, options]) : <Promise> -> <Entry>`
自身のパスからzip圧縮ファイルを生成し、そのエントリーインスタンスを返却します。  
内部的に[archiver](https://www.npmjs.com/package/archiver)を利用しています。

- [`dest` `<String | Function(this)>` `Default: 自身の拡張子をzipに置き換えたパス`] 圧縮ファイルの出力パス、もしくはそれを返却する関数
- `options` `<Object>`
	- [`level` `<Number>` `Default: 9`] 圧縮レベル
	- [`onWarning` `<Function>`] warning時のコールバックを指定します

#### `unzip(dest[, options]) : <Promise> -> <Entry>`
自身のパスのzip圧縮ファイルをディレクトリとして展開し、そのエントリーインスタンスを返却します。  
内部的に[decompress](https://www.npmjs.com/package/decompress)を利用しています。

- [`dest` `<String | Function(this)>` `Default: 自身のパスから拡張子を除いたパス`] 展開ディレクトリの出力パス、もしくはそれを返却する関数
- `options` `<Object>` [decompress](https://www.npmjs.com/package/decompress)参照



<a name="read"></a>
### Read（読み込み）
----

#### `readFile([*see]) : <Promise> -> <String> | <Buffer>`
自身のパスからファイルデータをロードします。  
引数は[こちら](https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback)の第2引数以降を参照してください。  
※`iconv-lite`がサポートしているエンコーディングを指定した場合、そのエンコーディングからutf-8へデコードした文字列を返却します。

#### `readFileSync([*see]) : <String> | <Buffer>`
`readFile` の同期版です。

#### `readText([charset = 'utf8']) : <Promise> -> <String>`

- `charset` `<String>` 文字コード

自身のパスからテキストデータをロードします。  
内部的にはreadFile(charset)しているだけです。

#### `readTextSync([charset = 'utf8']) : <String>`

- `charset` `<String>` 文字コード

自身のパスからテキストデータをロードします。  
内部的にはreadFileSync(charset)しているだけです。

#### `readJson([options]) : <Promise> -> <Object>`
自身のパスからテキストデータをjsonオブジェクトとしてロードします。  
内部的には`fs-extra`の[readJson](https://github.com/jprichardson/node-fs-extra/blob/master/docs/readJson.md)を実行しています。

#### `readJSON([options]) : <Promise> -> <Object>`
`readJson` のエイリアスです。

#### `readJsonSync([options]) : <Object>`
`readJson` の同期版です。

#### `readJSONSync([options]) : <Object>`
`readJsonSync` のエイリアスです。

#### `readYaml([options]) : <Promise> -> <Object>`
自身のパスからYamlテキストデータをロード、パースしjsonオブジェクトとして返却します。  
内部的には[js-yaml](https://www.npmjs.com/package/js-yaml)をパーサとして利用しています。  
オプションもこちらを参照してください。

#### `readYamlSync([options]) : <Object>`
`readYaml` の同期版です。



<a name="write"></a>
### Write（書き込み）
----

#### `writeFile(data[, options]) : <Promise> -> void`
自身のパスにデータを書き込みます。

- `data` `<String | Buffer>` 書き込むデータ
- `options` -> [fs.writeFile()](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback)参照

#### `writeFileSync(data[, options]) : void`
`writeFile` の同期版です。

#### `writeText(text[, charset]) : <Promise> -> void`
自身のパスにテキストデータを書き込みます。  
`charset`を指定した場合`iconv-lite`がサポートしていればその文字コードにエンコードして保存します。

- `text` `<String>` 書き込むテキスト
- `charset` `<String>` 保存する文字コード

#### `writeTextSync(text[, charset]) : <Promise> -> void`
`writeText` の同期版です。

#### `writeJson(object[, options]) : <Promise> -> void`
オブジェクトをjson文字列として自身のパスに書き込みます。

- `object` `<Object>` 書き込むjsonオブジェクト
- `options` `<Object>` [fs-extra - writeJson()](https://github.com/jprichardson/node-fs-extra/blob/master/docs/writeJson.md)を参照してください。

#### `writeJsonSync(object[, options]) : void`
`writeJson` の同期版です。

#### `writeYaml(object[, options]) : <Promise> -> void`
オブジェクトをYamlフォーマットの文字列として自身のパスに書き込みます。

- `object` `<Object>` 書き込むjsonオブジェクト
- `options` `<Object>`
	- `safe` `<Boolean>` `Default: true` safeDump, dumpのいずれを利用するかを決定します
	- その他のオプションは [js-yaml - safeDump(), dump()](https://www.npmjs.com/package/js-yaml)を参照してください。

#### `writeYamlSync(object[, options]) : void`
`writeYaml` の同期版です。



<a name="watch"></a>
### Watch（監視）
----

#### `watch(on, options) : this`
自身のパスに関してのファイル監視を開始します。  
内部的に[chokidar](https://www.npmjs.com/package/chokidar)を使用しています。  
監視できるイベント、オプション、プラットフォーム毎の差異については上記を参照してください。
このメソッドを実行してから`unwatch`するまでは、
this.watcher を参照する事で `chokidar ` の watcher オブジェクトを参照可能です。

- `on` `<Object>` リスナ（event: callback）の形式で複数指定可能です。 （例: `{ add: () => {}, change: () => {} ...}` ）
- `options` `<Object>` chokidarのwatcher生成時のオプションです。

監視するイベントが1つのみと時は、引数を下記のように構成する事も可能です。

- `event` `<String>` 監視するchokidarイベント
- `callback` `<Function>` コールバック
- `options` `<Object>` chokidarのwatcher生成時のオプションです。

#### `watchOn(event, callback) : this`
すでに`watch`でwatcherが生成された後に別のタイプのリスナーを追加する時に利用してください。
watchが開始していない時はこの処理は失敗します。

#### `unwatch() : this`
`watch`で開始した全てのリスナを解除します。  
これ以降 this.watcher は`undefined`となります。