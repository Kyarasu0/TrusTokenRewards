// 標準モジュール読み込み
import express from 'express';              // Expressフレームワーク
import path from 'path';                    // パス操作用
import cookieParser from 'cookie-parser';   // Cookie解析
import { fileURLToPath } from 'url';        // ESMで__dirnameを再現するために必要
import argon2 from 'argon2';                // パスワードハッシュ化
// symbol-sdk v3
import { SymbolFacade } from 'symbol-sdk/symbol';
import { PrivateKey } from 'symbol-sdk';
// 自作モジュール読み込み
import DBPerf from '../Tools/DBPerf.js';          // DB実行ラッパー
import { encrypt } from '../Tools/AESControl.js'; // AES暗号化関数
import CreateCookie from '../Tools/CreateCookie.js';

// __dirname 再生成
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express Router初期化
const router = express.Router();

// Cookieをreq.cookiesで扱えるようにする
router.use(cookieParser());

// JSONボディを解析可能にする
router.use(express.json());

// ==========================
// 画面表示ルート
// GET /Register/
// ==========================
router.get(
  '/',
  (req, res) => {
    // ==========================
    // 0. Startup Log
    // ==========================
    const logOwner = "/Register/";
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
// 登録処理ルート
// POST /Register/Submit
// ==========================
router.post(
  '/Submit',
  async (req, res) => {

    // ==========================
    // 0. Startup Log
    // ==========================
    const logOwner = "/Register/Submit";
    console.log(`\n[${logOwner}] ${logOwner}-API is running!\n`);

    // ==============================
    // 1. UserID, Passwordを受け取る
    // ==============================
    const { userId, password } = req.body;
    if (!userId || !password) {
      return res.status(400).json({
        message: "Bad Request: UserIDかPasswordが不足しています。"
      });
    }

    // ========================================
    // 2. UserIDが既に存在していないかを確認する
    // ========================================
    const exist = await DBPerf(
      "Duplicate Check For UserID",
      "SELECT * FROM Identify WHERE UserID = ?",
      [userId]
    );
    if (exist.length > 0) {
      return res.status(409).json({
        message: "Conflict: このユーザーIDはすでに使われています"
      });
    }

    // ==========================================
    // 3. Symbolブロックチェーン用アカウント生成
    // ==========================================
    // ファサードのインスタンス作成
    const facade = new SymbolFacade('testnet');
    // 秘密鍵の作成
    const privateKey = PrivateKey.random();
    // アカウントの作成
    const account    = facade.createAccount(privateKey);
    // アドレスを計算
    const address    = account.address.toString();
    // 秘密鍵を計算
    const privateKeyString = privateKey.toString();
    // 確認用ログ表示
    console.log(`[${logOwner}] Step3 Log: Symbolブロックチェーン用アカウント生成`);
    console.log("秘密鍵:", privateKeyString);
    console.log("アドレス:", address);

    // ============================
    // 4. Password + Pepper の作成
    // ============================
    // ペッパーの読み込み
    const pepper = process.env.PEPPER;
    if (!pepper) {
      return res.status(500).json({
        message: "Internal Server Error: サーバー設定エラー"
      });
    }
    // Password + Pepper
    // PepperはDBに保存しないサーバー専用秘密値
    const passwordWithPepper = password + pepper;
    // NFC登録のときに必要
    // const encryptPassword = encrypt(process.env.PEPPER, password);
    console.log(`[${logOwner}] Step4 Log: Passwordを使った秘密鍵の暗号化とPasswordのHash化`);
    console.log("Password + Pepper: ", passwordWithPepper);

    // ========================================
    // 5. 秘密鍵をPassword + PepperでAES暗号化
    // ========================================
    // ユーザーのパスワードから復号可能にする設計
    const encryptedPrivateKey = JSON.stringify( 
      encrypt(passwordWithPepper, privateKeyString)
    );
    console.log(`[${logOwner}] Step5 Log: 秘密鍵をPassword + PepperでAES暗号化`);
    console.log("秘密鍵: ", privateKeyString);
    console.log("暗号化された秘密鍵: ", encryptedPrivateKey);

    // =============================
    // 6. PasswordをArgon2でHash化
    // =============================
    const hashedPassword = await argon2.hash(passwordWithPepper, {
      type: argon2.argon2id,  // 現在推奨方式
      memoryCost: 2 ** 16,   // 64MB
      timeCost: 5,           // 計算回数
      parallelism: 1
    });

    // =============================
    // 7. Cookieを発行
    // =============================
    CreateCookie({
      res,
      cookieName: 'LOGIN_TOKEN',
      payload: { userId, address: address },
      secretKey: process.env.LOGIN_SECRET,
      deadlineHours: 24, // 1日有効
      httpOnly: true,
      sameSite: 'strict'
    });

    // ================
    // 8. DB保存
    // ================
    await DBPerf(
      "Insert Into Identify",
      "INSERT INTO Identify (UserID, Password, PrivateKey, Address) VALUES (?, ?, ?, ?)",
      [userId, hashedPassword, encryptedPrivateKey, address]
    );

    // ===================
    // 9. Shutdown Log
    // ===================
    console.log(`\n[${logOwner}] Shutdown!\n`);
    return res.json({ privateKey: privateKey.toString() });
  }
);

// Routerエクスポート
export default router;
