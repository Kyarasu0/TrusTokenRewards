import express from 'express';
import DBPerf from '../Tools/DBPerf.js'; // ESMでは拡張子(.js)が必要です
import VCM from '../Tools/VCM.js'; // ESMでは拡張子(.js)が必要です

const router = express.Router();


// ========== 画面表示 ==========
router.get('/', VCM('LOGIN_TOKEN', process.env.LOGIN_SECRET), async (req, res) => {
    console.log("/ProjectsList-API is running");

    const { roomName } = req.query;
    console.log(`Received RoomName: ${roomName}`);
    if (!roomName) {
        return res.status(400).json({ message: "roomName is required" });
    }
    const ProjectList = await DBPerf(
        "SELECT List",
        "SELECT p.ProjectsID, p.UserID, p.CreateDate, p.Content, SUM(pd.Amount) AS TotalAmount,COUNT(pd.TxID) AS TxCount FROM Projects p LEFT JOIN ProjectDetails pd ON p.ProjectsID = pd.ProjectsID WHERE p.RoomName = ? GROUP BY p.ProjectsID;", [roomName]
    );
    res.json({ ProjectList });
});

router.get('/:RoomName/:ProjectID', VCM('LOGIN_TOKEN', process.env.LOGIN_SECRET), async (req, res) => {
    console.log("/ProjectDetail-API is running");
    const { RoomName, ProjectID } = req.params;
    console.log(`Received RoomName: ${RoomName}, ProjectID: ${ProjectID}`);

    const Projects = await DBPerf(
        "SELECT Detail",
        "SELECT p.ProjectsID, p.RoomName, p.UserID, p.CreateDate, p.Content, SUM(pd.Amount) AS TotalAmount, COUNT(pd.TxID) AS TxCount FROM Projects p LEFT JOIN ProjectDetails pd ON p.ProjectsID = pd.ProjectsID WHERE p.ProjectsID = ? GROUP BY p.ProjectsID;", [ProjectID]
    );

    const ProjectDetails = await DBPerf(
        "SELECT Transactions",
        "SELECT fromUserID, Date, Amount FROM ProjectDetails WHERE ProjectsID = ?;", [ProjectID]
    );
    res.json({ projects: Projects[0], projectDetails: ProjectDetails });
});

export default router;