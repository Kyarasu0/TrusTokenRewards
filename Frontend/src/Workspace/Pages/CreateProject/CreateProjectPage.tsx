import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../../Components/organisms/Header/Header';
import PrimaryButton from '../../Components/atoms/Button/PrimaryButton';
import TextArea from '../../Components/atoms/TextArea/TextArea';
import styles from './CreateProjectPage.module.css';

interface Props {
  showToast: (msg: string) => void;
  onLogout: () => void;
}

/**
 * CreateProject ページ
 * 既存のルームに参加するためのフォーム。
 * ルーム名とパスワードを入力して参加します。
 */
export default function CreateProjectPage({ showToast, onLogout }: Props) {
  const navigate = useNavigate();

  // フォーム送信時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('成果を投稿しました！');
    // 実際にはAPIで検証して、ホームページへリダイレクト
    navigate('/Projects');
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
          <h1 className={styles.title}>成果を投稿</h1>
          <p className={styles.subtitle}>
            自分の成果をルームメンバーに共有しましょう。
            <br />
            自分の最近の成果を投稿してみてください。
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* 成果内容 */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>成果内容 *</label>
              <TextArea
                placeholder="どんな成果を出しましたか？"
                rows={6}
                required
              />
            </div>

            {/* 投稿ボタン */}
            <PrimaryButton type="submit">
              成果を投稿する
            </PrimaryButton>
          </form>
        </div>
      </main>
    </>
  );
}
