import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Coins } from 'lucide-react';
import type { ProjectData } from '../../data/rooms';
import Header from '../../Components/organisms/Header/Header';
import PrimaryButton from '../../Components/atoms/Button/PrimaryButton';
import TextInput from '../../Components/atoms/Input/TextInput';
import styles from './ProjectDetailPage.module.css';

interface Props {
  showToast: (msg: string) => void;
  onLogout: () => void;
}

/**
 * ProjectDetail ページ
 * 投稿の詳細と送金機能を表示します。
 * - 投稿内容
 * - 過去の送金履歴
 * - 秘密鍵と送金料の入力欄
 */
export default function ProjectDetailPage({ showToast, onLogout }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const project = location.state?.project as ProjectData | undefined;

  if (!project) {
    return (
      <>
        <Header onLogout={onLogout} showToast={showToast} />
        <div style={{ padding: '40px' }}>投稿が見つかりません</div>
      </>
    );
  }

  // 秘密鍵を入力して送金
  const handleSendToken = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('トークンを送信しました！');
  };

  return (
    <>
      <Header onLogout={onLogout} showToast={showToast} />

      <main className={styles.container}>
        {/* 戻るボタン */}
        <button
          className={styles.backButton}
          onClick={() => navigate('/projects')}
          title="戻る"
        >
          <ArrowLeft size={24} />
        </button>

        {/* 投稿本体 */}
        <div className={styles.projectBox}>
          <div className={styles.authorHeader}>
            <div>
              <div className={styles.authorName}>{project.authorName}</div>
              <div className={styles.roomInfo}>
                {project.roomName}
              </div>
              <div className={styles.timestamp}>{project.timestamp}</div>
            </div>
          </div>

          <div className={styles.content}>
            {project.content}
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <Coins size={20} />
              <span>受け取った通貨: {project.totalReceived}</span>
            </div>
            <div className={styles.stat}>
              <span>応援: {project.transactions?.length ?? 0} 件</span>
            </div>
          </div>
        </div>

        {/* 送金履歴セクション */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>応援履歴</h2>
          <div className={styles.transactionsList}>
            {project.transactions && project.transactions.length > 0 ? (
              project.transactions.map((tx) => (
                <div key={tx.id} className={styles.transactionItem}>
                  <div className={styles.txContent}>
                    <div className={styles.senderName}>{tx.senderName}</div>
                    <div className={styles.txTime}>{tx.timestamp}</div>
                  </div>
                  <div className={styles.txAmount}>+{tx.amount}</div>
                </div>
              ))
            ) : (
              <div className={styles.noTransactions}>
                まだ応援がありません。最初の応援者になりましょう！
              </div>
            )}
          </div>
        </div>

        {/* トークン送信フォーム */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>応援を送る</h2>
          <form onSubmit={handleSendToken} className={styles.form}>
            <TextInput
              type="password"
              placeholder="秘密鍵を入力"
              required
            />
            <TextInput
              type="number"
              placeholder="送金料を入力"
              min="1"
              required
            />
            <PrimaryButton type="submit">
              <Coins size={18} />
              <span>トークンを送信</span>
            </PrimaryButton>
          </form>
        </div>
      </main>
    </>
  );
}
