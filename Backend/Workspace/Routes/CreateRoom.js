// 標準モジュール読み込み
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { randomUUID } from "crypto";
// 自作モジュール読み込み
import VCM from '../Tools/VCM.js';
import DBPerf from '../Tools/DBPerf.js';
import { decrypt } from '../Tools/AESControl.js';
// Symbolに関する自作モジュール読み込み
import { CreateMosaicTx } from '../Tools/CreateMosaicTx.js';
import { CreateSupplyTx } from '../Tools/SupplyMosaic.js';
import SignAndAnnounce from '../Tools/SignAndAnnounce.js';

// __dirname 再生成
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express Router 初期化
const router = express.Router();

// Cookieをreq.cookiesで扱えるようにする
router.use(cookieParser());

// RAMにファイルを一時保存
const upload = multer({ storage: multer.memoryStorage() });

// ==========================
// アイコン画像保存用関数
// ==========================
function SaveIcon(file, folder) {
    // ==========================
    // 0. Startup Log
    // ==========================
    const logOwner = "SaveIcon";
    console.log(`\n[${logOwner}] ${logOwner}-Function is running!\n`);
    // Input Log
    console.log(`[${logOwner}] Input => file: ${file}, folder: ${folder}`);

    // 拡張子を取得
    const ext = path.extname(file.originalName);
    // UUID + 拡張子で一意的なファイル名に変換
    const fileName = `${randomUUID()}${ext}`;
    // 保存用フォルダのパスを取得
    const dir = path.join(__dirname, "..", "Icons", folder);

    // フォルダが存在しない場合は作成
    fs.mkdirSync(dir, { recursive: true });

    // ファイルのパスを取得
    const fullPath = path.join(dir, fileName);
    // ファイルのパスで指定した場所にファイルを保存
    fs.writeFileSync(fullPath, file.buffer);

    // Output Log
    console.log(`[${logOwner}] Output => path: /Icons/${folder}/${fileName}`);
    // 5. Shutdown Log
    console.log(`\n[${logOwner}] Shutdown!\n`);

    // DBに入れる用の「相対パス」
    return `/Icons/${folder}/${fileName}`;
}

// ==========================
// 画面表示ルート
// GET /CreateRoom/
// ==========================
router.get(
  '/',
  VCM('LOGIN_TOKEN', process.env.LOGIN_SECRET),
  (req, res) => {
    // ==========================
    // 0. Startup Log
    // ==========================
    const logOwner = "/CreateRoom/";
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
// ルーム作成ルート
// POST /CreateRooom/Submit
// ==========================
router.post(
    '/Submit',
    VCM('LOGIN_TOKEN', process.env.LOGIN_SECRET),
    upload.fields([{ name: "RoomIcon", maxCount: 1 },{ name: "MosaicIcon", maxCount: 1 }]),
    async (req, res) => {

        // ==========================
        // 0. Startup Log
        // ==========================
        const logOwner = "/CreateRoom/Submit";
        console.log(`\n[${logOwner}] ${logOwner}-API is running!\n`);

        // =================================================================================
        // 1. roomName, roomDiscription, roomPassword, mosaicName, userPassword を受け取る
        // =================================================================================
        const userId = req.auth.userId;
        const { roomName, roomDiscription, roomPassword, mosaicName, userPassword } = req.body;
        if (!userId || !roomName || !roomDiscription || !roomPassword || !mosaicName || !userPassword) {
            return res.status(400).json({
                message: "Bad Request: 情報が不足しています。"
            });
        }else if (!req.files?.RoomIcon){
            return res.status(400).json({
                message: "Bad Request: ルーム用のアイコンが不足しています。"
            });
        }

        // ==============================
        // 2. 秘密鍵の復号と取得
        // ==============================
        const OwnerInfor = await DBPerf(
            "Get Encrypted Private Key",
            "SELECT PrivateKey FROM Identify WHERE userID = ?",
            [userId]
        );
        const encryptedPrivateKeyObj = JSON.parse(OwnerInfor[0].PrivateKey);
        const privateKey = decrypt(inputPassword + process.env.PEPPER, encryptedPrivateKeyObj);

        try{
            // ==============================
            // 3. Mosaicの発行
            // ==============================
            // Mosaic発行トランザクションの作成
            const { mosaicId, mosaicDefinitionTx, keyPair, facade } = CreateMosaicTx({
                networkType: 'testnet',
                senderPrivateKey: privateKey,
                transferable: true,
                deadlineHours: 24
            });
            // Mosaic発行トランザクションのアナウンス
            const definitionResult = await SignAndAnnounce(
            mosaicDefinitionTx,
            privateKey,
            facade,
            'https://sym-test-01.opening-line.jp:3001',
            {
                waitForConfirmation: true,
                confirmationTimeoutMs: 180000,
                pollIntervalMs: 2000
            }
            );
            console.log(`[${logOwner}] Step3 Log: Mosaicの発行`);
            console.log(`[${logOwner}] Mosaic Definition TX Hash:`, definitionResult.hash);

            // ==============================
            // 4. Mosaicの供給
            // ==============================
            // Mosaic供給トランザクションの作成
            const { supplyTx, keyPair: supplyKeyPair, facade: supplyFacade } = CreateSupplyTx({
            networkType: 'testnet',
            senderPrivateKey: privateKey,
            mosaicId: mosaicId,
            supply: 1_000_000n,  // 初期供給量：100万（divisibility=0なので実際の量）
            deadlineHours: 24
            });
            // Mosaic供給トランザクションのアナウンス
            const supplyResult = await SignAndAnnounce(
            supplyTx,
            privateKey,
            supplyFacade,
            'https://sym-test-01.opening-line.jp:3001',
            {
                waitForConfirmation: true,
                confirmationTimeoutMs: 180000,
                pollIntervalMs: 2000
            }
            );
            console.log(`[${logOwner}] Step4 Log: Mosaicの供給`);
            console.log(`[${logOwner}] Mosaic Definition TX Hash:`, supplyResult.hash);
        }  catch (txErr) {
            console.error(`[${logOwner}] Blockchain Transaction Error:`, txErr);
            return res.status(500).json({ 
                message: "Failed to register mosaic on blockchain",
                error: txErr.message 
            });
        }

        // ==============================
        // 5. 渡された情報の保存
        // ==============================
        const roomIconPath = await SaveIcon(req.files.RoomIcon[0], "Rooms");
        await DBPerf(
            "INSERT RoomDetails",
            "INSERT INTO RoomDetails(RoomName, RoomIconPath, MosaicName) VALUES (?, ?, ?)",
            [roomName, roomIconPath, mosaicName]
        );
        await DBPerf(
            "INSERT Rooms",
            "INSERT INTO Rooms(UserID, RoomName) VALUES (?, ?)",
            [userId, roomName]
        );

        // ==============================
        // 6. Shutdown Log
        // ==============================
        console.log(`\n[${logOwner}] Shutdown!\n`);
        return res.status(201).json({ message: "Room created successfully" });
    }
);

// Routerエクスポート
export default router;