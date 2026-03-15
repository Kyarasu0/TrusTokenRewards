# TrusTokenRewards

仕事の貢献や成果をチームメンバー同士でトークン（Symbol ブロックチェーン上のモザイク）として送り合い、可視化するプラットフォームです。

---

## 概要

- **ルーム**単位でチームを管理し、メンバーが成果（プロジェクト）を投稿します。
- 他のメンバーは投稿に対してトークンを送ることで「応援」できます。
- トークンの送受信は Symbol テストネット上のトランザクションとして記録されます。

---

## ブロックチェーンを使う意義

- 送金履歴が Symbol 上のトランザクションとして残るため、誰が・いつ・どれだけ応援したかを後から検証しやすく、DB だけで管理する場合よりも改ざん耐性を持たせられます。
- Symbol の Mosaic を使うことで、ルームごとに独自トークンを発行でき、チームやプロジェクト単位で意味のあるインセンティブ設計を実現できます。
- ブロックチェーンに記録されることで、アプリ運営者だけに依存しない形で貢献の履歴を可視化でき、評価や応援の透明性を高められます。
- Symbol は企業利用を意識した設計と SDK が整っており、アカウント生成やトークン送付をアプリケーションに組み込みやすいため、本プロジェクトのような業務貢献の可視化基盤と相性が良いです。


## 技術スタック

| レイヤー | 技術 |
|---|---|
| フロントエンド | React (TypeScript) + Vite |
| バックエンド | Node.js (Express, ESM) |
| データベース | MySQL 8 |
| ブロックチェーン | Symbol テストネット (symbol-sdk v3) |

---

## ディレクトリ構成

```
TrusTokenRewards/
├── docker-compose.yml        # 要作成
├── nginx/
│   └── default.conf          # Nginx リバースプロキシ設定
├── Backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── .env                  # 環境変数（要作成）
│   └── Workspace/
│       ├── Server.js         # Express エントリポイント
│       ├── DB/
│       │   └── init.sql      # DB 初期化スキーマ
│       ├── Routes/           # API ルート
│       │   ├── Login.js
│       │   ├── Register.js
│       │   ├── Home.js
│       │   ├── Rooms.js
│       │   ├── CreateRoom.js
│       │   ├── JoinRoom.js
│       │   ├── CreateProject.js
│       │   └── SendToken.js
│       └── Tools/            # ユーティリティ
│           ├── AESControl.js
│           ├── CreateCookie.js
│           ├── CreateTransferTx.js
│           ├── DBPerf.js
│           ├── SignAndAnnounce.js
│           ├── VCM.js
│           └── LeftToken.js
└── Frontend/
    ├── package.json
    ├── vite.config.ts
    └── src/
        └── Workspace/
            ├── Pages/        # 各画面
            ├── Components/   # UI コンポーネント
            ├── Functions/    # API 呼び出し
            └── hooks/        # カスタムフック
```

---

## セットアップ

### 前提条件

- Docker / Docker Compose がインストールされていること
- Node.js 20 以上（フロントのビルドのみローカルで実行する場合）

### 1. 環境変数ファイルの作成

`Backend/.env` を **ファイルとして**作成してください（現在ディレクトリになっている場合は削除して再作成）。

```
Backend/.env
```

```env
PORT=Express サーバーが使用するポート番号
LOGIN_SECRET=<任意の長い文字列>

DB_HOST=MySQLサーバのホスト名
DB_USER=MySQL接続ユーザー
DB_PASSWORD=MySQL接続パスワード
DB_NAME=使用するデータベース名

PEPPER=<任意の長い文字列>
DUMMY_PASSWORD=<argon2id でハッシュ化したダミーパスワード>
```

> `DUMMY_PASSWORD` はサイドチャネル攻撃対策のため、実際の argon2id ハッシュ文字列を設定してください。

### 2. フロントエンドのビルド

```bash
cd Frontend
npm install
npm run build
cd ..
```

### 3. Docker Compose で起動

```bash
docker compose up --build
```

| サービス | ポート |
|---|---|
| Nginx (フロント + API プロキシ) | `80` |
| Backend (Express) | `5000` |
| MySQL | `3307` |

ブラウザで `http://localhost` にアクセスすると画面が表示されます。

---

## 使用ガイド

### 1. ユーザー登録

- 初回利用時は登録画面から UserID とパスワードを入力してアカウントを作成します。
- 登録時に Symbol アカウントが自動生成され、秘密鍵は暗号化された状態で保存されます。

### 2. ログイン

- 登録した UserID とパスワードでログインします。
- ログインに成功すると Cookie が発行され、各画面・API にアクセスできるようになります。

### 3. ルームを作成または参加

- チームや用途ごとにルームを作成します。
- 既存ルームに参加する場合は、ルーム名とルームパスワードを入力して参加します。
- ルームごとに Symbol Mosaic が紐づいており、そのルーム内で使うトークン単位が決まります。

### 4. 成果を投稿

- ルーム内でプロジェクトや成果を投稿します。
- 投稿内容は他メンバーが確認でき、応援対象として一覧表示されます。

### 5. 投稿にトークンを送る

- 投稿詳細画面で送金額とパスワードを入力し、投稿者にトークンを送ります。
- 送金時には秘密鍵を一時的に復号して Symbol トランザクションへ署名し、送信結果を DB とブロックチェーンの両方に反映します。

### 6. 履歴を確認する

- プロジェクト詳細画面では、投稿ごとの受取総額や送金履歴を確認できます。
- トランザクションは Symbol テストネットにも記録されるため、応援の履歴を後から検証できます。

---

## API 一覧

| メソッド | パス | 説明 | 認証 |
|---|---|---|---|
| GET | `/Login` | ログイン画面 | 不要 |
| POST | `/Login/Submit` | ログイン処理（Cookie 発行） | 不要 |
| GET | `/Register` | 登録画面 | 不要 |
| POST | `/Register/Submit` | ユーザー登録 + Symbol アカウント生成 | 不要 |
| GET | `/Home` | ホーム画面 | Cookie |
| GET | `/Home/RoomList` | 参加ルーム一覧取得 | Cookie |
| POST | `/CreateRoom/Submit` | ルーム作成 | Cookie |
| POST | `/JoinRoom/Submit` | ルーム参加 | Cookie |
| GET | `/Rooms` | プロジェクト一覧取得 (`?roomName=`) | Cookie |
| GET | `/Rooms/:RoomName/:ProjectID` | プロジェクト詳細取得 | Cookie |
| POST | `/CreateProject/Submit` | 成果投稿 | Cookie |
| GET | `/SendToken/Balance` | 残高確認 | Cookie |
| POST | `/SendToken/:ProjectID/Submit` | トークン送金 | Cookie |

---

## DB スキーマ

```
Identify       ユーザー情報（UserID, Password, Address, PrivateKey）
Mosaic         Symbol モザイク情報（MosaicID, MosaicName, OwnerUserID）
RoomDetails    ルーム情報（RoomName, RoomPassword, RoomIconPath, MosaicName）
Rooms          ユーザーとルームの参加関係
Projects       投稿（プロジェクト）
ProjectDetails トークン送金履歴
```

---

## 認証フロー

1. ログイン成功時に JWT を `LOGIN_TOKEN` Cookie（HttpOnly / SameSite=Strict）として発行。
2. 各 API は `VCM`（VerifyCookieMiddleware）で Cookie を検証し、`req.auth` にペイロードを展開。

---

## 秘密鍵の管理

- 登録時に Symbol アカウントを自動生成。
- 秘密鍵は `Password + PEPPER` を鍵とした AES 暗号化の上で DB に保存。
- 送金時にユーザーがパスワードを入力することで、サーバーサイドで一時的に復号してトランザクションに署名。**秘密鍵の平文はメモリ上のみで扱い、永続化しません。**

---

# ブロックチェーンの使い方

このアプリでは、Symbol ブロックチェーンを「応援トークンの発行・送付・検証」に利用しています。単に保存先として使うのではなく、アプリ内の操作とブロックチェーン上の処理が対応する形になっています。

### 1. ユーザー登録時

- ユーザー登録時に Symbol アカウントを自動生成します。
- 生成した秘密鍵はそのまま保存せず、`Password + PEPPER` を鍵として暗号化して DB に保存します。
- これにより、後続の送金処理でユーザー本人のみが署名に必要な秘密鍵を復元できます。

### 2. ルーム作成時

- ルーム作成時に、そのルーム専用の Mosaic を作成します。
- この Mosaic が、そのルーム内でやり取りされる「応援トークン」になります。
- ルームごとにトークンを分けることで、別チームや別プロジェクトの評価が混ざらない設計にしています。

### 3. 残高確認時

- 投稿詳細や送金前の画面では、対象ユーザーのアドレスと MosaicID を使って Symbol ノードから残高を取得します。
- これにより、DB の値ではなくブロックチェーン上の実残高を基準に送金可否を判断できます。

### 4. トークン送金時

- ユーザーが送金額とパスワードを入力すると、サーバー側で秘密鍵を一時的に復号します。
- 復号した秘密鍵を使って Symbol の Transfer Transaction を生成し、署名してネットワークへアナウンスします。
- トランザクション確定後、その TxHash を DB に保存し、アプリ内の送金履歴とブロックチェーン上の記録を対応付けます。

### 5. 送金履歴の確認時

- アプリでは DB に保存した送金履歴を一覧表示します。
- 同時に、各送金は Symbol 上のトランザクションとして残っているため、必要に応じて TxHash を起点に外部から検証できます。

### 6. この構成にしている理由

- 日常的な画面表示や集計は DB で扱い、検索性と表示速度を確保します。
- 価値移転そのものは Symbol に記録し、改ざん耐性と透明性を確保します。
- つまり、このアプリでは「表示と管理は DB」「送金記録はブロックチェーン」という役割分担をしています。

