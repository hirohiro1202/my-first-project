# 立替明細アプリ — 実装計画と仕様

## ユーザー確定要件
1. 毎晩、当日の未入力案件を通知する。
2. ICOCA履歴を自動で候補表示し、案件に紐付ける。
3. 案件別・日付別の両方で経費を確認する。
4. Googleカレンダーの予定には予定名・場所・案件名・クライアント名が含まれる想定。

## 現在のMVP
ブラウザ内で明細・案件を管理し、CSV取込・CSV出力を行う静的Webアプリ。現段階ではデータ保存は端末内のみ。

## 実運用に必要な次の工程
- [ ] 実際のICOCA利用履歴CSVサンプルで列マッピングと重複判定を検証
- [ ] Google Calendar OAuth連携（読み取り権限を最小化）
- [ ] カレンダー予定と案件名／クライアント名の候補マッチング
- [ ] 毎晩の未入力通知（Web Push / メール / Slack等の通知先と許可設定が必要）
- [ ] 認証・クラウドDBを導入し、PC・スマホ間で同期
- [ ] 月次の既存Excel立替明細テンプレートへの出力形式を確認
- [ ] テスト、アクセシビリティ、スマホでの操作確認
- [ ] 公開URLを設定し、利用開始手順を作成

## データモデル（初期）
Project: id, name, client, note, createdAt
Expense: id, date, amount, title, category, projectId, payee, note, paid, createdAt
ImportRecord: sourceId, date, amount, description, linkedExpenseId

## 実装上の注意
Google Calendar / Apple Pay ICOCAへ直接接続するにはOAuth・API制約・ユーザーの認証操作が必要。アプリからカード決済や履歴を無断取得する設計にはしない。現在のMVPは接続済みを装わず、ユーザーがファイルを選択して取り込む方式。
