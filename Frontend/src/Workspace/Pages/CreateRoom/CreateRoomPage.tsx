import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../../Components/organisms/Header/Header';
import TextInput from '../../Components/atoms/Input/TextInput';
import PrimaryButton from '../../Components/atoms/Button/PrimaryButton';
import styles from './CreateRoomPage.module.css';

interface Props {
  showToast: (msg: string) => void;
  onLogout: () => void;
}

/**
 * CreateRoom ページ
 * 新しいルーム（組織）を作成するためのフォーム。
 * 以下の情報を入力して送信します：
 * - ルーム名
 * - ルーム説明
 * - ルームパスワード
 * - 通貨名
 * - 秘密鍵
 * - ルームアイコン（オプション）
 */
export default function CreateRoomPage({ showToast, onLogout }: Props) {
  const navigate = useNavigate();

  // フォーム送信時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('ルームを作成しました！');
    // 実際にはAPIで送信して、ホームページへリダイレクト
    navigate('/home');
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
              />
            </div>

            {/* ルーム説明 */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>説明 *</label>
              <textarea
                className={styles.textarea}
                placeholder="ルームの目的や説明を入力"
                required
              />
            </div>

            {/* ルームパスワード */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>ルームパスワード *</label>
              <TextInput
                type="password"
                placeholder="メンバーが参加時に入力します"
                required
              />
            </div>

            {/* 通貨名 */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>通貨名 *</label>
              <TextInput
                type="text"
                placeholder="例: MarketingCoin"
                required
              />
            </div>

            {/* 秘密鍵 */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>秘密鍵 *</label>
              <TextInput
                type="password"
                placeholder="ルームの秘密鍵を入力"
                required
              />
            </div>

            {/* ルームアイコン（オプション） */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>ルームアイコン（オプション）</label>
              <TextInput
                type="text"
                placeholder="アイコンの絵文字または名前"
              />
            </div>

            {/* 送信ボタン */}
            <PrimaryButton type="submit">
              ルームを作成する
            </PrimaryButton>
          </form>
        </div>
      </main>
    </>
  );
}
