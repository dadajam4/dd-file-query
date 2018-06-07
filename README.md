# dd-file-query
`glob`ベースのディレクトリ、ファイル操作ユーティリティーです。

*This document currently exists only in Japanese.

※このモジュールは現在試験公開中です。商用での利用には注意が必要です。

インストール
----
```
$ npm install dd-file-query
```

これは何？
----
ファイル操作系のモジュールを寄せ集めて、ラッピングしたものです。  
ファイル操作の際の検索や実際の処理を楽にコーディングできるよう省略できるよう、個人利用目的で作成したものです。  
パフォーマンスには気を配りながら作成してますが、内部的に情報を一部オンメモリキャッシュ（stats等）する事と、  
各外部モジュールへの関数呼び出しのオーバーヘッドがあるので、超ハイパフォーマンスを求める局面では不向きかもしれません。  
小〜中規模（どの程度だ？）なプロダクトでファイルシステム操作を楽チンにしたい時に利用します。  
※インターフェースは完全僕の好みなので、向かない方もいると思います。

どんなモジュールを利用している？
----
現時点、以下のモジュールを利用しています。（これらは `fq`、およびその派生クラスインスタンスの全てで `.util[モジュール名]`で参照可能です）  
下記の全ての素晴らしいモジュールの製作者に感謝します。

- [glob](https://www.npmjs.com/package/glob)
- [fs-extra](https://www.npmjs.com/package/fs-extra)
- [parse-filepath](https://www.npmjs.com/package/parse-filepath)
- [js-yaml](https://www.npmjs.com/package/js-yaml)
- [file-type](https://www.npmjs.com/package/file-type)
- [archiver](https://www.npmjs.com/package/archiver)
- [decompress](https://www.npmjs.com/package/decompress)
- [iconv-lite](https://www.npmjs.com/package/iconv-lite)
- [chardet](https://www.npmjs.com/package/chardet)
- [chokidar](https://www.npmjs.com/package/chokidar)

何ができる？
----
`glob`でのファイル検索、および以下のような事ができます。

- ファイルの存在確認
- ファイル情報の取得（種別、エンコーディング、サイズ、MIMEタイプ、a、b、c、birthtime、、、etc）
- セーフパス生成
- ファイル読み込み（buffer、テキスト（文字コード変換付き）、JSON、Yaml）
- ファイル書き込み（buffer、テキスト（文字コード変換付き）、JSON、Yaml）
- 削除
- 複製
- コピー
- リネーム
- 移動
- zip圧縮
- zip展開
- ディレクトリツリー情報の取得（JSON or テキスト）
- ファイル、ディレクトリのwatch


使い方
----
このモジュールは2通りの利用方法があります。

### Entries、及びEntryインスタンスを取得してからいろんな事をやる場合
```js
const fq = require('dd-file-query');

(async () => {
  const entries = await fq.load('path/to/**/*.txt');
  await entries.delAll();
})();
```

### ファクトリーから直接操作のみを行う場合
```js
const fq = require('dd-file-query');

(async () => {
  await delAll('path/to/**/*.txt');
})();
```

Factory & Class API
----
- [fq](./docs/fq.md)
- [Entries](./docs/Entries.md)
- [Entry](./docs/Entry.md)


このモジュールで作らなかった機能
----
- rsync → cliに依存する事と、rsyncは今のところこのモジュールのインターフェースに合わせるメリットが見つからなかったため
- Stream系 → 現状不要と判断。将来的に必要を感じたら作る

TEST
----
`npm test`


License
-------

Licensed under MIT

Copyright (c) 2018 [dadajam4](https://github.com/dadajam4)
