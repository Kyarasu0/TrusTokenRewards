// Server.js解釈の都合上ファイル名をRooms.jsにしているが実際は成果一覧を返すプログラム

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
// 成果一覧表示ルート
// GET /Rooms/:RoomName/ProjectList
// ==========================
router.get(
  '/:RoomName/ProjectList',
  VCM('LOGIN_TOKEN', process.env.LOGIN_SECRET),
  async (req, res) => {

    // ==========================
    // 0. Startup Log
    // ==========================
    const logOwner = "/Rooms/ProjectList";
    console.log(`\n[${logOwner}] ${logOwner}-API is running!\n`);

    // ==========================================
    // 1. CookieからUserID取得
    // ==========================================
    const userId = req.auth.userId;

    // Input Log
    const RoomName = req.params.RoomName;
    console.log(`[${logOwner}] Input => userId: ${userId}, roomName: ${RoomName}`);

    // ==========================================
    // 2. Project一覧取得
    // ==========================================
    const ProjectList = await DBPerf(
      "Show Projects",
      `SELECT 
          ProjectsID,
          UserID,
          Content
       FROM Projects
       WHERE RoomName = ?
       ORDER BY ProjectsID DESC`,
      [RoomName]
    );

    // ==========================
    // 3. JSON再構成
    // ==========================
    let resultList = [];

    for (const v of ProjectList) {

      resultList.push({
        projectsID: v.ProjectsID,
        userID: v.UserID,
        content: v.Content
      });

    }

    // Output Log
    console.log(`[${logOwner}] Output => resultList: ${JSON.stringify({ resultList })}`);

    // ==========================
    // 4. Shutdown Log
    // ==========================
    console.log(`\n[${logOwner}] Shutdown!\n`);

    return res.json({ resultList });

  }
);

// ==========================
// Project詳細表示ルート
// GET /Rooms/:RoomName/:ProjectID
// ==========================
router.get(
  '/:RoomName/:ProjectID',
  VCM('LOGIN_TOKEN', process.env.LOGIN_SECRET),
  async (req, res) => {

    const logOwner = "/Rooms/ProjectDetail";

    console.log(`\n[${logOwner}] ${logOwner}-API is running!\n`);

    const userId = req.auth.userId;

    const RoomName = req.params.RoomName;
    const ProjectID = req.params.ProjectID;

    console.log(`[${logOwner}] Input => userId:${userId}, room:${RoomName}, project:${ProjectID}`);


    // ==========================
    // 1 Project取得
    // ==========================
    const Project = await DBPerf(
      "Get Project",
      `
      SELECT
        p.ProjectsID,
        p.UserID,
        p.Content,
        p.Date
      FROM Projects p
      WHERE p.ProjectsID = ?
      `,
      [ProjectID]
    );


    if (Project.length === 0) {

      console.log(`[${logOwner}] Project not found`);

      return res.status(404).json({ message: "Project not found" });

    }


    // ==========================
    // 2 Transaction取得
    // ==========================
    const Transactions = await DBPerf(
      "Get ProjectDetails",
      `
      SELECT
        fromUserID,
        Content,
        Date,
        Amount,
        TxID
      FROM ProjectDetails
      WHERE ProjectsID = ?
      ORDER BY Date DESC
      `,
      [ProjectID]
    );


    let transactionList = [];

    let total = 0;

    for (const v of Transactions) {

      total += v.Amount;

      transactionList.push({

        id: v.TxID,
        senderName: v.fromUserID,
        content: v.Content,
        timestamp: v.Date,
        amount: v.Amount,
        txID: v.TxID

      });

    }


    const project = {

      id: Project[0].ProjectsID,
      authorName: Project[0].UserID,
      roomName: RoomName,
      content: Project[0].Content,
      timestamp: Project[0].Date,
      totalReceived: total,
      transactions: transactionList

    };


    console.log(`[${logOwner}] Output => ${JSON.stringify(project)}`);

    console.log(`\n[${logOwner}] Shutdown!\n`);

    return res.json({ project });

  }
);


// Routerエクスポート
export default router;