import styles from "./HomePage.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LogIn, BookOpen } from "lucide-react";

import Header from "../../Components/organisms/Header/Header";
import RoomGrid from "../../Components/organisms/RoomGrid/RoomGrid";

import { getRooms } from "../../Functions/GetRooms";
import type { RoomData } from "../../data/rooms";

interface Props {
  onLogout: () => void;
  showToast: (message: string) => void;
}

export default function HomePage({ onLogout, showToast }: Props) {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomData[]>();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms();
        setRooms(data);
      } catch {
        console.warn("API取得失敗 → モック使用");
      }
    };

    fetchRooms();
  }, []);

  const handleRoomJoin = (roomName: string) => {
    showToast(`${roomName} に参加しました`);
  };

  return (
    <div className={styles.page}>

      <Header onLogout={onLogout} showToast={showToast} />

      <main className={styles.main}>
        {/* ナビゲーションボタン */}
        <div className={styles.navigationSection}>
          <button
            className={styles.navButton}
            onClick={() => navigate('/Projects')}
          >
            <BookOpen size={20} />
            <span>成果を見る</span>
          </button>
          <button
            className={styles.navButton}
            onClick={() => navigate('/CreateRoom')}
          >
            <Plus size={20} />
            <span>ルーム作成</span>
          </button>
          <button
            className={styles.navButton}
            onClick={() => navigate('/JoinRoom')}
          >
            <LogIn size={20} />
            <span>ルーム参加</span>
          </button>
        </div>

        <RoomGrid rooms={rooms} onJoinRoom={handleRoomJoin} />
      </main>

    </div>
  );
}