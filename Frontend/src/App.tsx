import styles from "./App.module.css";

import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// helper: HomeRoute でログアウト処理を定義
function HomeRoute({ showToast }: { showToast: (msg: string) => void }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    showToast("ログアウトしました");
    navigate("/Login");
  };
  return <HomePage showToast={showToast} onLogout={handleLogout} />;
}

// helper: ProjectsRoute でログアウト処理を定義
function ProjectsRoute({ showToast }: { showToast: (msg: string) => void }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    showToast("ログアウトしました");
    navigate("/Login");
  };
  return <ProjectsPage showToast={showToast} onLogout={handleLogout} />;
}

// helper: ProjectsRoute でログアウト処理を定義
function CreateProjectRoute({ showToast }: { showToast: (msg: string) => void }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    showToast("ログアウトしました");
    navigate("/Login");
  };
  return <CreateProjectPage showToast={showToast} onLogout={handleLogout} />;
}

// helper: ProjectDetailRoute でログアウト処理を定義
function ProjectDetailRoute({ showToast }: { showToast: (msg: string) => void }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    showToast("ログアウトしました");
    navigate("/Login");
  };
  return <ProjectDetailPage showToast={showToast} onLogout={handleLogout} />;
}

// helper: CreateRoomRoute でログアウト処理を定義
function CreateRoomRoute({ showToast }: { showToast: (msg: string) => void }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    showToast("ログアウトしました");
    navigate("/Login");
  };
  return <CreateRoomPage showToast={showToast} onLogout={handleLogout} />;
}

// helper: JoinRoomRoute でログアウト処理を定義
function JoinRoomRoute({ showToast }: { showToast: (msg: string) => void }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    showToast("ログアウトしました");
    navigate("/Login");
  };
  return <JoinRoomPage showToast={showToast} onLogout={handleLogout} />;
}

// Pages インポート
import HomePage from "./Workspace/Pages/Home/HomePage";
import LoginPage from "./Workspace/Pages/Login/LoginPage";
import RegisterPage from "./Workspace/Pages/Register/RegisterPage";
import ProjectsPage from "./Workspace/Pages/Projects/ProjectsPage";
import ProjectDetailPage from "./Workspace/Pages/ProjectDetail/ProjectDetailPage";
import CreateRoomPage from "./Workspace/Pages/CreateRoom/CreateRoomPage";
import JoinRoomPage from "./Workspace/Pages/JoinRoom/JoinRoomPage";
import CreateProjectPage from "./Workspace/Pages/CreateProject/CreateProjectPage";

// Components インポート
import AppBackground from "./Workspace/Components/organisms/layout/AppBackground/AppBackground";
import Toast from "./Workspace/Components/organisms/layout/Toast/Toast";

import { useState } from "react";

export default function App() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 文字列をトーストにセットして3秒後に非表示に戻す関数
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // onLogout handler will be defined inside route so that it can use navigate hook

  return (
      <div className={styles.app}>
        <AppBackground />

        <Routes>

          {/* ホームページではログアウト処理をルート内で定義 */}
          <Route
            path="/Home"
            element={<HomeRoute showToast={showToast} />}
          />

          {/* 成果・投稿一覧ページ */}
          <Route
            path="/Rooms/:RoomName"
            element={<ProjectsRoute showToast={showToast} />}
          />

          {/* 成果詳細ページ */}
          <Route
            path="/Rooms/:RoomName/:ProjectID"
            element={<ProjectDetailRoute showToast={showToast} />}
          />

          <Route
            path="/CreateProject"
            element={<CreateProjectRoute showToast={showToast} />}
          />

          {/* ルーム作成ページ */}
          <Route
            path="/CreateRoom"
            element={<CreateRoomRoute showToast={showToast} />}
          />

          {/* ルーム参加ページ */}
          <Route
            path="/JoinRoom"
            element={<JoinRoomRoute showToast={showToast} />}
          />

          {/* ログインページはナビゲーション内でトーストのみ受け取り */}
          <Route
            path="/Login"
            caseSensitive={false}
            element={<LoginPage showToast={showToast} />}
          />

          <Route
            path="/Register"
            caseSensitive={false}
            element={<RegisterPage showToast={showToast} />}
          />

          {/* その他のパスはホームへリダイレクト */}
          <Route path="*" element={<Navigate to="/Home" replace />} />
        </Routes>

        <Toast message={toastMessage} />
      </div>
  );
}