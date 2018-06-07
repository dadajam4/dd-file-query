# Class:Entries
glob検索でヒットしたパスから生成された[Entry](./Entry.md)が複数集まったオブジェクトです。  

<a name="array-like"></a>
## `Array` LIKEなプロパティ、メソッドについて
本インスタンスは複数の`Entry`を取り扱う`iterable`なオブジェクトです。  
`for of` 公文や、JavaScriptの`Array`インスタンスが保有している基本的なメソッドで、所持している`Entry`インスタンスを処理可能です。  
また、メソッドに関しては内部的に一度`Array.slice()`した配列に対して実行されます。

具体的に、`Array`と同等に参照、実行ができるものは以下の通りです。

Properties

- length

Methods

- every
- filter
- find
- findIndex
- forEach
- includes
- indexOf
- map
- reduce
- reduceRight
- some

<a name="ref-first-entry"></a>
## 暗黙的な`Entry`参照について
本インスタンスは、`Entry`インスタンスが保有しているプロパティやメソッドの多くが定義されています。これらを本インスタンスに対して参照、実行した場合、自身の先頭の`Entry`インスタンスに対して値の取得やメソッドの実行が行われます。  
例として、以下は同価です。

```
const entries = await fq.load('path/to/*.txt');
entries.del();
entries.first.del();
```

具体的に参照可能な名前は以下の通りです。

Properties

- path
- dirname
- ext
- extname
- name
- basename
- isDir
- isFile
- isSocket
- deleted
- watcher

Methods

- del
- copy
- duplicate
- move
- rename
- getFileType
- detectEncoding
- list
- createRenamedPath
- readFile
- readText
- readJson
- readJSON
- readYaml
- emptyDir
- ensureDir
- ensureFile
- writeFile
- writeText
- writeJson
- writeJSON
- writeYaml
- zip
- unzip
- tree
- watch
- watchOn
- unwatch

<a name="each-entries-methods"></a>
## 子`Entry`全てに対するメソッド実行
本インスタンスは、`Entry`インスタンスが保有しているいくつかのメソッドを「All」サフィックス付きで実行可能です。この結果は配列で返却されます。

```js
// 全て削除する例
await entries.delAll();

// これは以下と同じです
await Promise.all(entries.map(e => e.del()));

// 全てzipする例
await entries.zipAll(e => (e.path + '_ziped.zip'));
```

具体的に定義されているメソッドは以下の通りです。  
引数は`Entry`インスタンスの各メソッドを参照してください。

- delAll
- copyAll
- duplicateAll
- moveAll
- renameAll
- readFileAll
- readTextAll
- readJsonAll
- readJSONAll
- readYamlAll
- zipAll
- unzipAll
- watchAll
- watchOnAll
- unwatchAll



Properties
----
- `loaded` `<Boolean>` インスタンスがロード済みの場合`true`
- `loading` `<Boolean>` インスタンスがロード中の場合`true`
- `loaderror` `<Boolean>` インスタンスのロードに失敗した場合`true`
- `found` `<Array -> String>` glob検索でヒットしたパスの配列
- `statCache` `<Object>` [glob](https://www.npmjs.com/package/glob)で取得された`Stats`のキャッシュ
- `first` `<Entry>` ロードされた中で、先頭の`Entry`インスタンス
- `last` `<Entry>` ロードされた中で、末尾の`Entry`インスタンス
- `size` `<Number>` ロードされた`Entry`インスタンスの`size`の合計
- `foundPattern` `<String>` ヒットした`Entry`インスタンスのパスを連結してglobパターンに変換した文字列
- `pattern` `<String>` 初期化後に内部生成されたglobパターン
- `options` `<Object>` 初期化後に内部生成されたglobオプション
- `isSync` `Boolean` 同期初期化されたか
- `filters` `<Array -> Function>` 初期化後に内部生成されたフィルタメソッド
- `glob` `<Glob>` ロード時された`Glob`インスタンス
- `entries` `<Array -> Entry>` ロードされた`Entry`インスタンスの配列
- `hasMagic` `<Boolean> ` 初期化後に内部生成されたglobパラメータにマジックパラメータが含まれているか（複数検索対象か）


Methods
----

#### `load([isSync, relatedEntries]) : [<Promise> ->] this`
自身を（再）ロードします。  同期初期化された場合や、すでにロード済みの場合このメソッドを実行する必要はありません。  
`isSync`を`true`に設定した場合、`Promise`インスタンスを返却します。

- `isSync` `<Boolean>` `Default: false` 同期処理するか
- `relatedEntries ` `<Array -> Entry>` （再）ロードされた後にこのパラメータで渡された`Entry`のパスが自身の検索パターンと一致していた場合、自身のプロパティに渡された`Entry`を保持します。※このパラメータは通常利用であまり利用する必要はありません。

#### `getEntries() : <Array -> Entry>`
保持している`Entry`の配列を返却します。内部的に`Array.slice()`した配列を返却するので、配列に対する順序等の操作を行っても本インスタンスの状態を破壊する事はありません。

#### `get(index) : <Entry>`
保持している`Entry`の配列から指定したインデックスのものを返却します。

- `index` `<Number>` インデックス
