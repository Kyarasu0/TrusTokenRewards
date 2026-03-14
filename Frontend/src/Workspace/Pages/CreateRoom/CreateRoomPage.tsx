import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../../Components/organisms/Header/Header';
import TextInput from '../../Components/atoms/Input/TextInput';
import PrimaryButton from '../../Components/atoms/Button/PrimaryButton';
import styles from './CreateRoomPage.module.css';
import { useState } from "react";
import defaultImage from "../../../../public/Images/image.png";

interface Props {
  showToast: (msg: string) => void;
  onLogout: () => void;
}

export default function CreateRoomPage({ showToast, onLogout }: Props) {
  const navigate = useNavigate();

  // フォームの state
  const [roomIcon, setRoomIcon] = useState<File | null>(null);
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [mosaicName, setMosaicName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("roomName", roomName);
    formData.append("roomDiscription", roomDescription); // サーバー側と同名
    formData.append("roomPassword", roomPassword);
    formData.append("mosaicName", mosaicName);
    formData.append("userPassword", userPassword);

    if (roomIcon) {
      formData.append("roomIcon", roomIcon);
    }

    setIsCreating(true);
    try {
      const res = await fetch("/CreateRoom/Submit", {
        method: "POST",
        credentials: "include",
        body: formData
      });

      if (!res.ok) {
        const err = await res.json();
        showToast("ルーム作成に失敗しました: " + err.message);
        return;
      }

      showToast("ルームを作成しました！");
      navigate("/Home");

    } catch (err) {
      showToast("通信エラーが発生しました");
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <Header onLogout={onLogout} showToast={showToast} />

      <main className={styles.container}>
        <div className={styles.return}>
          <button
            className={styles.backButton}
            onClick={() => navigate(-1)}
            title="戻る"
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        <div className={styles.formCard}>
          <h1 className={styles.title}>新しいルームを作成</h1>
          <p className={styles.subtitle}>
            チームやプロジェクトの成果を共有するルームを作成しましょう。
            <br />
            メンバーはパスワードで参加できます。
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* ルーム名 */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>ルーム名 *</label>
              <TextInput
                type="text"
                placeholder="例: マーケティングチーム"
                required
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>

            {/* ルーム説明 */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>説明 *</label>
              <textarea
                className={styles.textarea}
                placeholder="ルームの目的や説明を入力"
                required
                value={roomDescription}
                onChange={(e) => setRoomDescription(e.target.value)}
              />
            </div>

            {/* ルームパスワード */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>ルームパスワード *</label>
              <TextInput
                type="password"
                placeholder="メンバーが参加時に入力します"
                required
                value={roomPassword}
                onChange={(e) => setRoomPassword(e.target.value)}
              />
            </div>

            {/* 通貨名 */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>通貨名 *</label>
              <TextInput
                type="text"
                placeholder="例: MarketingCoin"
                required
                value={mosaicName}
                onChange={(e) => setMosaicName(e.target.value)}
              />
            </div>

            {/* 秘密鍵（作成者のパスワード） */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>作成者パスワード *</label>
              <TextInput
                type="password"
                placeholder="ルーム作成者のパスワードを入力"
                required
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
              />
            </div>

            {/* ルームアイコン */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>ルームアイコン（オプション）</label>
              <label htmlFor="roomIcon" className={styles.fileUpload}>
                <img
                  src={roomIcon ? URL.createObjectURL(roomIcon) : defaultImage}
                  className={styles.iconPreview}
                  alt="ルームアイコン"
                />
                <p>画像を選択</p>
              </label>
              <input
                id="roomIcon"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => setRoomIcon(e.target.files?.[0] || null)}
              />
            </div>

            <PrimaryButton type="submit" disabled={isCreating}>
              {isCreating ? '作成中...' : 'ルームを作成する'}
            </PrimaryButton>
          </form>
        </div>
      </main>
    </>
  );
}