// 標準モジュール読み込み
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { randomUUID } from "crypto";
// 自作モジュール読み込み
import VCM from '../Tools/VCM.js';
import DBPerf from '../Tools/DBPerf.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express Router 初期化
const router = express.Router();

// Cookieをreq.cookiesで扱えるようにする
router.use(cookieParser());

// ==========================
// ルーム作成ルート
// POST /CreateRooom/Submit
// ==========================
router.post('/Submit', VCM('LOGIN_TOKEN', process.env.LOGIN_SECRET), async (req, res) => {
        // ==========================
        // 0. Startup Log
        // ==========================
        const logOwner = "/CreateProject/Submit";
        console.log(`\n[${logOwner}] ${logOwner}-API is running!\n`);

        // =================================================================================
        // 1.  UserID, Content を受け取る
        // =================================================================================
        const userId = req.auth.userId;
        const { roomName, content } = req.body;
        if (!userId || !content || !roomName) {
            return res.status(400).json({
                message: "Bad Request: 情報が不足しています。"
            });
        }

        // ==============================
        // 2. 渡された情報の保存
        // ==============================
        // ProjectのDB登録
        await DBPerf(
            "INSERT Project",
            "INSERT INTO Projects(UserID, RoomName, CreateDate, Content) VALUES (?, ?, CONVERT_TZ(NOW(),'UTC','Asia/Tokyo'), ?)",
                [userId, roomName, content]
            );

        // ==============================
        // 3. Shutdown Log
        // ==============================
        console.log(`\n[${logOwner}] Shutdown!\n`);
        return res.json({ message: "成果を投稿しました" });
    }
);

// Routerエクスポート
export default router;