# My First Project

HTML・CSS・JavaScript で作ったシンプルな静的 Web サイト。

## 機能

| 機能 | 詳細 |
|---|---|
| ダーク / ライトモード | OS 設定に連動し、切り替えは `localStorage` に保存 |
| あいさつ | 時間帯に応じたメッセージを表示 |
| カウンター | +1 / −1 / リセット（カウントは `localStorage` に保存） |
| お問い合わせフォーム | Formspree を利用した実送信機能（要設定） |

## ディレクトリ構成

```
my-first-project/
├── index.html            # メインページ
├── README.md
├── css/
│   ├── main.css          # エントリポイント（全 CSS を @import）
│   ├── variables.css     # CSS カスタムプロパティ（カラートークン）
│   ├── base.css          # リセット・タイポグラフィ
│   ├── layout.css        # header / hero / section / footer・レスポンシブ
│   └── components.css    # card / button / form / counter / theme-toggle
└── js/
    ├── main.js           # エントリポイント（全モジュールを初期化）
    ├── theme.js          # テーマ切り替え（FOUC 防止との連携）
    ├── counter.js        # カウンター（localStorage 保存）
    ├── greeting.js       # あいさつ
    └── form.js           # フォーム送信（Formspree）
```

## ローカルでの確認方法

ES Modules は `file://` では動作しないため、ローカルサーバーが必要です。

```bash
python3 -m http.server 3000
```

http://localhost:3000 をブラウザで開いてください。

## フォーム送信の設定（Formspree）

1. [Formspree](https://formspree.io) でアカウントを作成する
2. 「+ New Form」でフォームを作成し、フォーム ID を取得する（例: `abcdefgh`）
3. `js/form.js` の先頭にある `FORM_ENDPOINT` を更新する

```js
// 変更前
const FORM_ENDPOINT = "";

// 変更後
const FORM_ENDPOINT = "https://formspree.io/f/abcdefgh";
```

設定前は「フォームの送信先が設定されていません」と表示されます。

## ブランチ戦略

```
main              本番・安定版（直接コミット禁止）
 └── develop      統合ブランチ
      ├── feature/xxx   機能追加
      └── fix/xxx       バグ修正
```

## コミットメッセージ規約

| プレフィックス | 用途 |
|---|---|
| `feat:` | 新機能 |
| `fix:` | バグ修正 |
| `style:` | スタイル変更（機能影響なし）|
| `refactor:` | リファクタリング |
| `docs:` | ドキュメント変更 |
| `test:` | テスト追加・変更 |

## 開発運用ルール

- `main` への直接 commit は禁止
- 変更は作業ブランチで行う
- commit 後は GitHub へ push する
- Pull Request を作成して内容を確認する
- 承認後に `main` へマージする
