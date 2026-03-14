import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

import Header from '../../Components/organisms/Header/Header';
import PrimaryButton from '../../Components/atoms/Button/PrimaryButton';
import TextArea from '../../Components/atoms/TextArea/TextArea';

import styles from './CreateProjectPage.module.css';
import { useLocation } from "react-router-dom";

interface Props {
  showToast: (msg: string) => void;
  onLogout: () => void;
}

/**
 * CreateProject ページ
 * 成果を投稿するフォーム。
 */
export default function CreateProjectPage({ showToast, onLogout }: Props) {

  const navigate = useNavigate();
  const { RoomName } = useParams();

  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!RoomName) {
      showToast("RoomNameが取得できません");
      return;
    }

    const res = await fetch(`/Rooms/${RoomName}/CreateProject`, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        content
      })

    });

    if (!res.ok) {

      showToast("投稿失敗");
      return;

    }

    showToast("成果を投稿しました");

    navigate(`/Projects/${RoomName}`);

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

          <h1 className={styles.title}>成果を投稿</h1>

          <p className={styles.subtitle}>
            自分の成果をルームメンバーに共有しましょう。
            <br />
            自分の最近の成果を投稿してみてください。
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>

            <div className={styles.fieldGroup}>

              <label className={styles.label}>
                成果内容 *
              </label>

              <TextArea
                name="Content"
                placeholder="どんな成果を出しましたか？"
                rows={6}
                required
              />

            </div>

            <PrimaryButton type="submit">
              成果を投稿する
            </PrimaryButton>

          </form>

        </div>

      </main>
    </>
  );
}