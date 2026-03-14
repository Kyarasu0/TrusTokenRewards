// 標準モジュール読み込み
import express from 'express';                        // Webサーバーフレームワーク
import path from 'path';                              // パス操作用
import { fileURLToPath } from 'url';                  // ESMで __dirname を作るために必要
import argon2 from 'argon2';                          // パスワードハッシュ検証用
// 自作モジュール読み込み
import DBPerf from '../Tools/DBPerf.js';              // DBラッパー
import CreateCookie from '../Tools/CreateCookie.js';  // Cookie作成
import InverseVCM from '../Tools/InverseVCM.js';      // ログイン状態チェックミドルウェア

// __dirname 再生成
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express Router 初期化
const router = express.Router();

// JSONリクエストボディをパースできるようにする
router.use(express.json());

// ==========================
// 画面表示ルート
// GET /Login/
// ログイン済みの場合はアクセス拒否（InverseVCM）
// ログイン画面を返却
// ==========================
router.get(
  '/',
  InverseVCM('LOGIN_TOKEN', process.env.LOGIN_SECRET),
  (req, res) => {
    // ==========================
    // 0. Startup Log
    // ==========================
    const logOwner = "/Login/";
    console.log(`\n[${logOwner}] ${logOwner}-API is running!\n`);
    // ==========================
    // 1. Shutdown Log
    // ==========================
    console.log(`\n[${logOwner}] Shutdown!\n`);

    // ページを配って終了
    res.sendFile( path.join(__dirname, "..", "..", "..", "Frontend", "dist", "index.html") );
  }
);

// ==========================
// ログイン処理ルート
// POST /Login/Submit
// フロントエンドから送信された UserID と Password を受け取る
// DBからユーザー情報を取得
// ハッシュ検証後にクッキーを発行
// ==========================
router.post(
  '/Submit',
  InverseVCM('LOGIN_TOKEN', process.env.LOGIN_SECRET),
  async (req, res) => {

  // ==========================
  // 0. Startup Log
  // ==========================
  const logOwner = "/Login/Submit";
  console.log(`\n[${logOwner}] ${logOwner}-API is running!\n`);

  // ===============================
  // 1. UserID, Passwordを受け取る
  // ===============================
  const { userId, password } = req.body;
  if (!userId || !password) {
    return res.status(400).json({
      message: "Bad Request: UserIDかPasswordが不足しています。"
    });
  }

  // ==========================
  // 2. UserIDからデータを検索する
  // ==========================
  // UserIDからデータを検索
  const userInfo = await DBPerf(
    "Select From Identify To Login",
    "SELECT Address, Password FROM Identify WHERE UserID = ?;",
    [userId]
  );
  // データが登録されていなくてもダミーパスワードを用意(サイドチャネル攻撃対策)
  const hashToVerify = userInfo.length === 0 ? process.env.DUMMY_PASSWORD : userInfo[0].Password;

  // ==========================
  // 3. PasswordをArgon2でHash化し、検証する
  // ==========================
  const isVerified = await argon2.verify(hashToVerify, password + process.env.PEPPER);

  if (isVerified) {

    // ==========================
    //　4. 正しかったらUserID, Addressを含むCookieを返し、Homeへリダイレクト
    // ==========================
    // Verify Success Log
    console.log(`[${logOwner}] LoginToken is verified!`);
    // Cookie発行
    CreateCookie({
      res,
      cookieName: 'LOGIN_TOKEN',
      payload: { userId, address: userInfo[0].Address },
      secretKey: process.env.LOGIN_SECRET,
      deadlineHours: 24, // 1日有効
      httpOnly: true,
      sameSite: 'strict'
    });
    // リダイレクト
    res.redirect("/Home");

  } else {

    // ==========================
    //　4'. 正しくなかったらErrorを返す
    // ==========================
    //Verify Error Log
    console.error(`[${logOwner}] LoginToken is not verified!`);
    // ==========================
    // 5. Shutdown Log
    // ==========================
    console.log(`\n[${logOwner}] Shutdown!\n`);
    return res.status(400).json({ error: 'Bad Request: IDまたはPasswordが正しくありません。' });

  }
});

// Routerエクスポート
export default router;