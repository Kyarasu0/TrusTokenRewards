// 標準モジュール読み込み
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { randomUUID } from "crypto";
import argon2 from 'argon2';                // パスワードハッシュ化
// 自作モジュール読み込み
import VCM from '../Tools/VCM.js';
import DBPerf from '../Tools/DBPerf.js';
import { decrypt } from '../Tools/AESControl.js';
// Symbolに関する自作モジュール読み込み
import { CreateMosaicTx } from '../Tools/CreateMosaicTx.js';
import { CreateSupplyTx } from '../Tools/SupplyMosaic.js';
import SignAndAnnounce from '../Tools/SignAndAnnounce.js';
import { encrypt } from '../Tools/AESControl.js';

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
    const ext = path.extname(file.originalname);
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
        res.sendFile(path.join(__dirname, "..", "..", "..", "Frontend", "dist", "index.html"));
    }
);

// ==========================
// ルーム作成ルート
// POST /CreateRooom/Submit
// ==========================
router.post(
    '/Submit',
    VCM('LOGIN_TOKEN', process.env.LOGIN_SECRET),
    upload.fields([{ name: "roomIcon", maxCount: 1 }]),
    async (req, res) => {

        // ==========================
        // 0. Startup Log
        // ==========================
        const logOwner = "/CreateRoom/Submit";
        console.log(`\n[${logOwner}] ${logOwner}-API is running!\n`);

        // =================================================================================
        // 1. userId, roomName, roomDiscription, roomPassword, mosaicName, userPassword を受け取る
        // =================================================================================
        const userId = req.auth.userId;
        const { roomName, roomDiscription, roomPassword, mosaicName, userPassword } = req.body;
        if (!userId || !roomName || !roomDiscription || !roomPassword || !mosaicName || !userPassword) {
            return res.status(400).json({
                message: "Bad Request: 情報が不足しています。"
            });
        }

        // ==============================================================================
        // 2. roomPasswordの暗号化（変更したところ）
        // ==============================================================
        // ペッパーの読み込み
        const pepper = process.env.PEPPER;
        if (!pepper) {
            return res.status(500).json({
                message: "Internal Server Error: サーバー設定エラー"
            });
        }

        // Password + Pepper
        // PepperはDBに保存しないサーバー専用秘密値
        const passwordWithPepper = roomPassword + pepper;
        // NFC登録のときに必要
        // const encryptPassword = encrypt(process.env.PEPPER, password);
        console.log(`[${logOwner}] Log: Passwordを使った秘密鍵の暗号化とroomPasswordのHash化`);
        console.log("roomPassword + Pepper: ", passwordWithPepper);

        // PasswordをArgon2でHash化
        const hashedPassword = await argon2.hash(passwordWithPepper, {
              type: argon2.argon2id,  // 現在推奨方式
              memoryCost: 2 ** 16,   // 64MB
              timeCost: 5,           // 計算回数
              parallelism: 1
            });

        // ==============================
        // 3. 秘密鍵の復号と取得
        // ==============================
        const OwnerInfor = await DBPerf(
            "Get Encrypted Private Key",
            "SELECT PrivateKey FROM Identify WHERE userID = ?",
            [userId]
        );
        const encryptedPrivateKeyObj = JSON.parse(OwnerInfor[0].PrivateKey);
        const privateKey = decrypt(userPassword + process.env.PEPPER, encryptedPrivateKeyObj);

        // ==============================
        // 4. DB への事前登録（TX前）
        // ==============================
        // MosaicIdはTX前に生成しておく
        const { mosaicId, mosaicDefinitionTx, facade } = CreateMosaicTx({
            networkType: 'testnet',
            senderPrivateKey: privateKey,
            transferable: true,
            deadlineHours: 24
        });

        const roomIconPath = req.files?.roomIcon ? SaveIcon(req.files.roomIcon[0], "Rooms") : null;

        await DBPerf(
            "INSERT Mosaic",
            "INSERT INTO Mosaic(MosaicName, MosaicId, OwnerUserID) VALUES (?, ?, ?)",
            [mosaicName, mosaicId, userId]
        );
        await DBPerf(
            "INSERT RoomDetails",
            "INSERT INTO RoomDetails(RoomName, RoomPassword, RoomIconPath, MosaicName) VALUES (?, ?, ?, ?)",
            [roomName, hashedPassword, roomIconPath, mosaicName]
        );
        await DBPerf(
            "INSERT Rooms",
            "INSERT INTO Rooms(UserID, RoomName) VALUES (?, ?)",
            [userId, roomName]
        );
        console.log(`[${logOwner}] Step4 Log: DB事前登録完了`);

        try {
            // ==============================
            // 5. Mosaicの発行
            // ==============================
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
            console.log(`[${logOwner}] Step5 Log: Mosaicの発行`);
            console.log(`[${logOwner}] Mosaic Definition TX Hash:`, definitionResult.hash);

            // ==============================
            // 6. Mosaicの供給
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
            console.log(`[${logOwner}] Step6 Log: Mosaicの供給`);
            console.log(`[${logOwner}] Mosaic Supply TX Hash:`, supplyResult.hash);

        } catch (txErr) {
            // ==============================
            // TX失敗 → DB ロールバック
            // ==============================
            console.error(`[${logOwner}] Blockchain Transaction Error:`, txErr);
            try {
                await DBPerf("ROLLBACK DELETE Rooms",     "DELETE FROM Rooms       WHERE UserID = ? AND RoomName = ?", [userId, roomName]);
                await DBPerf("ROLLBACK DELETE RoomDetails","DELETE FROM RoomDetails WHERE RoomName = ?",                [roomName]);
                await DBPerf("ROLLBACK DELETE Mosaic",    "DELETE FROM Mosaic      WHERE MosaicName = ?",              [mosaicName]);
                // アイコンファイルも削除
                if (roomIconPath) {
                    const iconFullPath = path.join(__dirname, "..", roomIconPath);
                    if (fs.existsSync(iconFullPath)) fs.unlinkSync(iconFullPath);
                }
                console.log(`[${logOwner}] Rollback completed`);
            } catch (rollbackErr) {
                console.error(`[${logOwner}] Rollback failed:`, rollbackErr);
            }

                // エラー種別に応じたメッセージ
                const errCode = txErr.message || "";
                if (errCode.includes("Insufficient_Balance")) {
                    return res.status(402).json({
                        message: "XYMの残高が不足しています。テストネットのfaucetからXYMを受け取ってから再度お試しください。"
                    });
                }
                if (errCode.includes("timeout")) {
                    return res.status(504).json({
                        message: "トランザクションの承認がタイムアウトしました。しばらく待ってから再度お試しください。"
                    });
                }
                return res.status(500).json({
                    message: "ブロックチェーントランザクションに失敗しました。",
                    error: errCode
                });
        }

        // ==============================
        // 7. Shutdown Log
        // ==============================
        console.log(`\n[${logOwner}] Shutdown!\n`);
        return res.status(200).json({ message: "ルームを作成しました！" });
    }
);

// Routerエクスポート
export default router;