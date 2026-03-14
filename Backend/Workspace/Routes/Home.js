// 標準モジュール読み込み
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
// 自作モジュール読み込み
import DBPerf from '../Tools/DBPerf.js';
import VCM from '../Tools/VCM.js';
import { LeftTokenAmount } from '../Tools/LeftToken.js';

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
router.get('/RoomList', VCM('LOGIN_TOKEN', process.env.LOGIN_SECRET), async (req, res) => {
    // ==========================
    // 0. Startup Log
    // ==========================
    const logOwner = "/Home/RoomList";
    console.log(`\n[${logOwner}] ${logOwner}-API is running!\n`);

    // ==========================================
    // 1. CookieからのUserIDとそのアドレスを取得
    // ==========================================
    const userId = req.auth.userId;
    // Input Log
    console.log(`[${logOwner}] Input => userId: ${userId}`);
    const userAddressResult = await DBPerf(
        "Get Address",
        `SELECT Address FROM Identify WHERE UserID = ?;`,
        [userId]
    );
    const userAddress = userAddressResult[0].Address;

    // ==========================
    // 2. Roomを一覧表示して返す
    // ==========================
    // 必要最低限必要な情報を取る
    const RoomList = await DBPerf(
        "Show Rooms",
        `SELECT 
            rd.RoomName,
            rd.RoomIconPath
        FROM RoomDetails rd
        JOIN Rooms r ON rd.RoomName = r.RoomName
        WHERE r.UserID = ?`,
        [userId]
    );
    let resultList = [];
    // Room人数とそれぞれのRoomでの残高をJSONに組み込んで再構成
    for (const v of RoomList) {
        const RoomHeadcount = await DBPerf(
            "Show RoomHeadcounts",
            "SELECT Count(*) FROM Rooms WHERE RoomName = ?;",
            [v.RoomName]
        );
        const MosaicIDResult = await DBPerf(
            "Get MosaicID",
            "SELECT MosaicID FROM Mosaic m JOIN RoomDetails rd ON m.MosaicName = rd.MosaicName WHERE rd.RoomName = ?;",
            [v.RoomName]
        );
        const MosaicID = MosaicIDResult[0].MosaicID;
        const nodeUrl = 'https://sym-test-01.opening-line.jp:3001';
        const balance = await LeftTokenAmount(userAddress, MosaicID, nodeUrl);
        resultList.push({ 
            roomName: v.RoomName, 
            roomIconPath: v.RoomIconPath, 
            roomName: v.RoomName,
            roomHeadcount: RoomHeadcount,
            balance: Number(balance)
        })
    }
    // Output Log
    console.log(`[${logOwner}] Output => resultList: ${JSON.stringify({ resultList })}`);
    // ==========================
    // 3. Shutdown Log
    // ==========================
    console.log(`\n[${logOwner}] Shutdown!\n`);
    return res.json({ resultList });
});

// Routerエクスポート
export default router;