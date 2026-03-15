// 標準モジュール読み込み
import express from 'express';
import crypto from 'crypto';
// 自作モジュール読み込み
import DBPerf from '../Tools/DBPerf.js';
import VCM from '../Tools/VCM.js';
import { decrypt } from '../Tools/AESControl.js';
// Symbolに関する自作モジュール読み込み
import CreateTransferTx from '../Tools/CreateTransferTx.js';
import SignAndAnnounce from '../Tools/SignAndAnnounce.js';
import { LeftTokenAmount, GetCurrencyMosaicId } from '../Tools/LeftToken.js';

// Express Router 初期化
const router = express.Router();

// ==========================
// 送金時の残高表示ルート
// POST /SendToken/Balance
// ==========================
router.get(
    '/Balance',
    VCM('LOGIN_TOKEN', process.env.LOGIN_SECRET),
    async (req, res) => {

        // ==========================
        // 0. Startup Log
        // ==========================
        const logOwner = "/CreateRoom/Submit";
        console.log(`\n[${logOwner}] ${logOwner}-API is running!\n`);

        // =================================
        // 1. userId, roomName を受け取る
        // =================================
        const userId = req.auth.userId;
        const { roomName } = req.body;
        if (!userId || !roomName ) {
            return res.status(400).json({
                message: "Bad Request: 情報が不足しています。"
            });
        }

        // =================================
        // 2. Addressを特定する
        // =================================
        const userAddressResult = await DBPerf(
            "Get Address",
            `SELECT Address
            FROM Identify
            WHERE UserID = ?`,
            [userId]
        )
        let userAddress = "";
        if (userAddressResult.length > 0) userAddress = userAddressResult[0].Address;
        else return res.status(500).json({ message: 'Addressの取得に失敗しました。' });


        // =================================
        // 3. MosaicIDを特定する
        // =================================
        const mosaicResult = await DBPerf(
            "Get MosaicID",
            `SELECT r.MosaicName, m.MosaicID
            FROM RoomDetails r
            JOIN Mosaic m
                ON r.MosaicName = m.MosaicName
            WHERE RoomName = ?`,
            [roomName]
        )
        let mosaicId = "";
        let mosaicName = "";
        if (mosaicResult.length > 0) {
            mosaicId = mosaicResult[0].MosaicID;
            mosaicName = mosaicResult[0].MosaicName;
        }
        else return res.status(500).json({ message: 'MosaicIDの取得に失敗しました。' });

        // =================================
        // 4. 残高を取得して返す
        // =================================
        const nodeUrl = 'https://sym-test-01.opening-line.jp:3001';
        const balance = await LeftTokenAmount(userAddress, mosaicId, nodeUrl);
        return res.status(200).json({
            roomName,
            mosaicName,
            balance: Number(balance)
        });
    }
);

// ==========================
// 通常送金ルート
// POST /SendToken/:ProjectID/Submit
// ==========================
router.post(
    '/:ProjectID/Submit',
    VCM('LOGIN_TOKEN', process.env.LOGIN_SECRET),
    async (req, res) => {

        // ==========================
        // 0. Startup Log
        // ==========================
        const logOwner = "/SendToken/Submit";
        console.log(`\n[${logOwner}] ${logOwner}-API is running!\n`);

        try {

            // =================================
            // 1. パラメータ取得
            // =================================
            const fromUserID = req.auth.userId;
            const ProjectID = req.params.ProjectID;
            const { senderUserID, roomName, password, Amount } = req.body;
            const parsedAmount = Number(Amount);
            if (!fromUserID || !senderUserID || !roomName || !ProjectID || !password || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
                return res.status(400).json({
                    message: "Bad Request: パラメータが不正です"
                });
            }

            // =================================
            // 2. 送金者情報取得
            // =================================
            const fromUser = await DBPerf(
                "送金元Address, PrivateKey取得",
                `SELECT Address, PrivateKey
                 FROM Identify
                 WHERE UserID = ?`,
                [fromUserID]
            );
            if (!fromUser.length) return res.status(404).json({ message: "送金者が見つかりません" });
            const {
                Address: fromAddress,
                PrivateKey: encryptedPrivateKey,
            } = fromUser[0];

            // =================================
            // 3. 送金先Address取得
            // =================================
            const toUser = await DBPerf(
                "送金先Address取得",
                `SELECT Address
                 FROM Identify
                 WHERE UserID = ?`,
                [senderUserID]
            );
            if (!toUser.length) return res.status(404).json({ message: "送金先ユーザーが見つかりません" });
            const sendToAddress = toUser[0].Address;

            if(fromUserID === senderUserID) {
                return res.status(400).json({
                    message: "Bad Request: 送金元と送金先が同一です"
                });
            }

            // =================================
            // 4. MosaicID取得
            // =================================
            const mosaicResult = await DBPerf(
                "Mosaic取得",
                `SELECT m.MosaicID
                 FROM RoomDetails r
                 JOIN Mosaic m
                    ON r.MosaicName = m.MosaicName
                 WHERE r.RoomName = ?`,
                [roomName]
            );
            if (!mosaicResult.length) return res.status(404).json({ message: "Mosaicが見つかりません" });
            const MosaicIDHex = mosaicResult[0].MosaicID;

            // =================================
            // 5. 残高チェック
            // =================================
            const nodeUrl = 'https://sym-test-01.opening-line.jp:3001';
            const currentAmount = await LeftTokenAmount(fromAddress, MosaicIDHex, nodeUrl);
            if (currentAmount < BigInt(parsedAmount)) {
                return res.status(400).json({
                    message: "トークン残高不足",
                    balance: currentAmount.toString()
                });
            }

            // =================================
            // 6. XYM残高チェック(手数料)
            // =================================
            const currencyMosaicId = await GetCurrencyMosaicId(nodeUrl);
            const xymAmount = await LeftTokenAmount(fromAddress, currencyMosaicId, nodeUrl);
            const transferFee = 100_000n;
            if (xymAmount < transferFee) {
                return res.status(400).json({
                    message: "XYM不足（手数料が払えません）",
                    required: transferFee.toString(),
                    balance: xymAmount.toString()
                });
            }

            // =================================
            // 8. 秘密鍵復号
            // =================================
            const pepper = process.env.PEPPER;
            const encryptedPrivateKeyObj =
                typeof encryptedPrivateKey === 'string'
                    ? JSON.parse(encryptedPrivateKey)
                    : encryptedPrivateKey;
            const decryptedPrivateKey = decrypt(password + pepper, encryptedPrivateKeyObj);

            // =================================
            // 11. DB仮保存
            // =================================
            const tempTxId = crypto.randomUUID();

            await DBPerf(
                "送金仮保存",
                `INSERT INTO ProjectDetails
                (ProjectsID, fromUserID, Date, Amount, TxID)
                VALUES (?, ?, CONVERT_TZ(NOW(),'UTC','Asia/Tokyo'), ?, ?)`,
                [ProjectID, fromUserID, parsedAmount, tempTxId]
            );

            try {

                // =================================
                // 12. トランザクション作成
                // =================================
                const { tx, facade } = CreateTransferTx({
                    networkType: 'testnet',
                    senderPrivateKey: decryptedPrivateKey,
                    recipientRawAddress: sendToAddress,
                    messageText: `Direct Transfer`,
                    fee: transferFee,
                    mosaics: [
                        {
                            mosaicId: BigInt(`0x${MosaicIDHex}`),
                            amount: BigInt(parsedAmount)
                        }
                    ],
                    deadlineHours: 2
                });

                // =================================
                // 13. トランザクション送信
                // =================================
                const announceResult = await SignAndAnnounce(
                    tx,
                    decryptedPrivateKey,
                    facade,
                    nodeUrl,
                    {
                        waitForConfirmation: true,
                        confirmationTimeoutMs: 120000,
                        pollIntervalMs: 2000
                    }
                );

                if (!announceResult.confirmed) {
                    throw new Error("トランザクション未確定");
                }

                // =================================
                // 14. DB更新 (TxHash)
                // =================================
                await DBPerf(
                    "TxHash更新",
                    `UPDATE ProjectDetails
                    SET TxID = ?
                    WHERE TxID = ?`,
                    [announceResult.hash, tempTxId]
                );

            } catch (err) {

                // =================================
                // 失敗 → DB削除
                // =================================
                await DBPerf(
                    "仮保存削除",
                    `DELETE FROM ProjectDetails WHERE TxID = ?`,
                    [tempTxId]
                );

                console.error("送金失敗:", err);

                return res.status(500).json({
                    message: "送金失敗のためDBをロールバックしました"
                });
            }

            // =================================
            // 成功レスポンス
            // =================================
            return res.status(200).json({
                message: "OK :送金成功"
            });
            

        } catch (err) {

            console.error("[SendToken Error]", err);
            return res.status(500).json({ message: `${err.message || "送金処理に失敗しました"}` });

        }

    }
);

// Routerエクスポート
export default router;