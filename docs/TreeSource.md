# Class: TreeSource
`Entry`インスタンスや、`fq`ファクトリの`tree()`メソッドで生成されるディレクトリ階層状のクラスです。  
自身のメンバに`Entry`インスタンスを1つ保有しています。

Properties
----
- `path` `<String>` フルパス
- `root` `<TreeSource>` rootのツリーインスタンス
- `parent` `<TreeSource>` 親ディレクトリのツリーインスタンス
- `depth` `<Number>` rootツリーからの深さです。rootが`0`
- `absolutePath` `<String>` rootツリーからの相対パス
- `entry` `<Entry>` 自身の`path`で生成された`Entry`インスタンス
- `children` `<Array -> TreeSource>` 自身がディレクトリである場合、自身の直下のツリーインスタンスの集合
- `length` `<Number>` `children`を持っている場合その数
- `index` `<Number>` 親ツリーの`children`の中での自身のインデックス
- `isLastChild` `<Boolean>` 親ツリーの`children`の中で自身が一番最後であれば`true`

※以下の全てのプロパティは自身の`entry`のプロパティを間接参照します

- `dirname`
- `ext`
- `extname`
- `name`
- `basename`
- `size`
- `atime`
- `btime`
- `ctime`
- `birthtime`
- `isDir`
- `isFile`
- `isSocket`

Methods
----
#### `toJSON() : <Object>`
自身と、自身の`children`の全てを辿った情報をjson構造で返却します。  
例えばフロントエンドのアプリケーションにAPIの戻り値として渡して、  
ファイルエクスプローラーアプリケーションを作成する時などに利用する事を想定しています。

レスポンスは以下の構造です。

- `path` `<String>`
- `depth` `<Number>`
- `absolutePath` `<String>`
- `dirname` `<String>`
- `ext` `<String>`
- `extname` `<String>`
- `name` `<String>`
- `basename` `<String>`
- `size` `<String>`
- `atime` `<String>`
- `btime` `<String>`
- `ctime` `<String>`
- `birthtime` `<String>`
- `isDir` `<Boolean>`
- `isFile` `<Boolean>`
- `isSocket` `<Boolean>`
- `children` `<Array>` ※ディレクトリでない場合はキー自体存在しません
	- ... 



#### `toString([setting]) : <String>`
自身と、自身の`children`の全てを辿った階層構造を文字列で返却します。  
Linuxの`tree`コマンドとほぼ同じです。  
デバッグや、階層構造の可視化に利用する事を想定しています。 

- `setting ` `<Object>`
	- `fullBasePath` `<Boolean>` `Default: true` 頂点のパス表示を振るパス表示するか、ベースネームの表示のみにするかを決定する
	- `loopChar` `<String>` `Default: '├'` ファイル1つごとの区切り線
	- `lastChar` `<String>` `Default: '└'` ディレクトリ内で最後のファイルを示す
	- `fillChar` `<String>` `Default: '│'` インデントされたディレクトリを包括している事を示す
	- `fillIndentChar` `<String>` `Default: ' '` `fillChar` の右につく空白
	- `indentChar` `<String>` `Default: '─'` インデント表示のキャラクタ
	- `spaceChar` `<String>` `Default: ' '` ファイル名と線の間の空白キャラクタ
	- `indentSize` `<Number>` `Default: 2` 階層1つ分のインデントサイズ

##### 出力例
```
path/to/root
├── dir1
│   ├── file1.gif
│   ├── file2.json
│   ├── file3.js
│   └── file4
├── dir2
│   ├── dir1
│   ├── file2.txt
│   └── マルチバイト.yml
├── file1.txt
├── file2.txt
├── file3.js
└── file4
```