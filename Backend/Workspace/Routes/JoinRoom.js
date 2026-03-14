// 標準モジュール読み込み
import express from 'express';
// 自作モジュール読み込み
import DBPerf from '../Tools/DBPerf.js';
import VCM from '../Tools/VCM.js';

// Express Router 初期化
const router = express.Router();

// JSONボディを解析可能にする
router.use(express.json());

// ==========================
// 画面表示ルート
// GET /JoinRoom/
// ==========================
router.get(
  '/',
  VCM('LOGIN_TOKEN', process.env.LOGIN_SECRET),
  (req, res) => {
    // ==========================
    // 0. Startup Log
    // ==========================
    const logOwner = "/JoinRoom/";
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
// ルーム参加ルート
// POST /JoinRoom/Submit
// ==========================
router.post(
    '/Submit',
    VCM('LOGIN_TOKEN', process.env.LOGIN_SECRET),
    async (req, res) => {
    
    // ==========================
    // 0. Startup Log
    // ==========================
    const logOwner = "/JoinRoom/Submit";
    console.log(`\n[${logOwner}] ${logOwner}-API is running!\n`);

    // =====================================
    // 1. RoomName, RoomPasswordを受け取る
    // =====================================
    const userId = req.auth.userId;
    const roomName = req.body?.roomName;
    const roomPassword = req.body?.password;
    if (!userId || !roomName || !roomPassword) {
        return res.status(400).json({ message: 'Bad Request: userIdかroomNameかroomPasswordが不足しています。' });
    }

    // =============================================================================
    // 2. RoomNameがちゃんと存在しているか、まだ属していないかを確認し、Roomに参加する
    // =============================================================================
    // RoomNameがちゃんと存在しているかの確認
    const roomExists = await DBPerf(
        'Check Room Exists',
        'SELECT RoomName, RoomPassword FROM RoomDetails WHERE RoomName = ?',
        [roomName]
    );
    if (roomExists.length === 0) {
        return res.status(404).json({ message: 'Not Found: 指定されたルームは存在しません' });
    }
    // ルームパスワードの確認
    if (roomExists[0].RoomPassword !== roomPassword) {
        return res.status(401).json({ message: 'Unauthorized: ルームパスワードが間違っています' });
    }
    // そのRoomにまだ属していないかを確認する
    const alreadyJoined = await DBPerf(
        'Check Already Joined',
        'SELECT 1 FROM Rooms WHERE UserID = ? AND RoomName = ?',
        [userId, roomName]
    );
    if (alreadyJoined.length > 0) {
        return res.status(409).json({ message: 'Conflict: 既にこのルームに所属しています' });
    }
    // Roomに参加する
    await DBPerf(
        'Insert Room Member',
        'INSERT INTO Rooms (UserID, RoomName) VALUES (?, ?)',
        [userId, roomName]
    );

    const JoinContent = `${userId}さんが参加しました!.`;

    await DBPerf(
        'Increment Room Member Count',
        "INSERT INTO Projects (UserID, RoomName, CreateDate, Content) VALUES(?, ?, CONVERT_TZ(NOW(),'UTC','Asia/Tokyo'), ?)",
        [userId, roomName, JoinContent]
    );

    // ==============================
    // 3. Shutdown Log
    // ==============================
    console.log(`\n[${logOwner}] Shutdown!\n`);
    return res.redirect("/Home");
});

// Routerエクスポート
export default router;
