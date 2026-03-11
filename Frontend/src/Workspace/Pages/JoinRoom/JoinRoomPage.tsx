import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../../Components/organisms/Header/Header';
import TextInput from '../../Components/atoms/Input/TextInput';
import PrimaryButton from '../../Components/atoms/Button/PrimaryButton';
import styles from './JoinRoomPage.module.css';

interface Props {
  showToast: (msg: string) => void;
  onLogout: () => void;
}

/**
 * JoinRoom ページ
 * 既存のルームに参加するためのフォーム。
 * ルーム名とパスワードを入力して参加します。
 */
export default function JoinRoomPage({ showToast, onLogout }: Props) {
  const navigate = useNavigate();

  // フォーム送信時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('ルームに参加しました！');
    // 実際にはAPIで検証して、ホームページへリダイレクト
    navigate('/Home');
  };

  return (
    <>
      <Header onLogout={onLogout} showToast={showToast} />

      <main className={styles.container}>
        <div className={styles.return}>
            {/* 戻るボタン */}
            <button
            className={styles.backButton}
            onClick={() => navigate(-1)}
            title="戻る"
            >
            <ArrowLeft size={24} />
            </button>
        </div>

        <div className={styles.formCard}>
          <h1 className={styles.title}>ルームに参加</h1>
          <p className={styles.subtitle}>
            既存のルームに参加して、成果の共有を始めましょう。
            <br />
            ルーム管理者から教えてもらったパスワードを入力してください。
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* ルーム名 */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>ルーム名 *</label>
              <TextInput
                type="text"
                placeholder="参加したいルームの名前"
                required
              />
            </div>

            {/* ルームパスワード */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>ルームパスワード *</label>
              <TextInput
                type="password"
                placeholder="ルームのパスワード"
                required
              />
            </div>

            {/* 参加ボタン */}
            <PrimaryButton type="submit">
              ルームに参加する
            </PrimaryButton>
          </form>

          {/* ルーム作成へのリンク */}
          <div className={styles.alternativeAction}>
            <p>新しいルームを作成したい？</p>
            <button
              className={styles.linkButton}
              onClick={() => navigate('/CreateRoom')}
            >
              ルームを作成する
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
