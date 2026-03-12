// 標準モジュール読み込み
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
// 自作モジュール読み込み
import DBPerf from '../Tools/DBPerf.js';
import VCM from '../Tools/VCM.js';

// __dirname 再生成
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express Router 初期化
const router = express.Router();

// ==========================
// 画面表示ルート
// GET /Home/
// ==========================
router.get(
  '/',
  VCM('LOGIN_TOKEN', process.env.LOGIN_SECRET),
  (req, res) => {
    // ==========================
    // 0. Startup Log
    // ==========================
    const logOwner = "/Home/";
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
// Room一覧表示ルート
// GET /Home/RoomList
// ==========================
router.get('/', VCM('LOGIN_TOKEN', process.env.LOGIN_SECRET), async (req, res) => {
    // ==========================
    // 0. Startup Log
    // ==========================
    const logOwner = "/Home/RoomList";
    console.log(`\n[${logOwner}] ${logOwner}-API is running!\n`);

    // ==========================
    // 1. CookieからのUserIDの取得
    // ==========================
    const userId = req.auth.userId;
    // Input Log
    console.log(`[${logOwner}] Input => userId: ${userId}`);

    // ==========================
    // 2. Roomを一覧表示して返す
    // ==========================
    const RoomList = await DBPerf(
        "Show Rooms",
        "SELECT RoomName, RoomIconPath FROM RoomDetails WHERE RoomName IN (SELECT RoomName FROM Rooms WHERE UserID = ?)", [userId]
    );
    // Output Log
    console.log(`[${logOwner}] Output => RoomList: ${JSON.stringify({ RoomList })}`);
    // ==========================
    // 3. Shutdown Log
    // ==========================
    console.log(`\n[${logOwner}] Shutdown!\n`);
    return res.json({ RoomList });
});

// Routerエクスポート
export default router;