# TrusTokenRewards

仕事の貢献や成果をチームメンバー同士でトークン（Symbol ブロックチェーン上のモザイク）として送り合い、可視化するプラットフォームです。

---

## 概要

- **ルーム**単位でチームを管理し、メンバーが成果（プロジェクト）を投稿します。
- 他のメンバーは投稿に対してトークンを送ることで「応援」できます。
- トークンの送受信は Symbol テストネット上のトランザクションとして記録されます。

---

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フロントエンド | React (TypeScript) + Vite |
| バックエンド | Node.js (Express, ESM) |
| データベース | MySQL 8 |
| ブロックチェーン | Symbol テストネット (symbol-sdk v3) |
| リバースプロキシ | Nginx |
| インフラ | Docker / Docker Compose |

---

## ディレクトリ構成

```
TrusTokenRewards/
├── docker-compose.yml
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
LOGIN_SECRET=<任意の長い文字列>
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
| POST | `/SendToken/Submit` | トークン送金 | Cookie |

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
