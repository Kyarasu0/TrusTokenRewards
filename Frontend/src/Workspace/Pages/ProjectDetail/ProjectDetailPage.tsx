
import { ArrowLeft, Coins } from 'lucide-react';
import Header from '../../Components/organisms/Header/Header';
import PrimaryButton from '../../Components/atoms/Button/PrimaryButton';
import TextInput from '../../Components/atoms/Input/TextInput';
import styles from './ProjectDetailPage.module.css';
import { useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const { RoomName, ProjectID }= useParams();
  const [project, setProject] = useState<any>(null);
  const [projectDetails, setProjectDetails] = useState<any[]>([]);
  useEffect(() => {
    async function fetchProjectDetail() {
      try {
        const res = await fetch(`/Rooms/${RoomName}/${ProjectID}`, {
          method: "GET",
          credentials: "include",
        });
        if(!res.ok){
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setProject(data.projects);
        setProjectDetails(data.projectDetails);
      }catch (error) {
        console.error("Error fetching project detail:", error);
      }
    }

    fetchProjectDetail();
  }, [ProjectID, RoomName]);

  if (!project) {
    return (
      <>
        <Header onLogout={onLogout} showToast={showToast} />
        <div style={{ padding: '40px' }}>投稿が見つかりません</div>
      </>
    );
  }

  // 秘密鍵を入力して送金
  const handleSendToken = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const senderUserID = project.UserID; // 送金先は投稿者
    const roomName = project.RoomName;
    const password = form.Password.value;
    const Amount = form.Amount.value;
    // ここでバックエンドに送金リクエストを送る
    try {
      fetch(`/SendToken/Submit`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ senderUserID, roomName, password, Amount })
      });
      showToast('トークンを送信しました！');
    } catch (err) {
      console.error("Error sending token:", err);
      showToast('トークンの送信に失敗しました。もう一度お試しください。');
    };
  };

  return (
    <>
      <Header onLogout={onLogout} showToast={showToast} />

      <main className={styles.container}>
        {/* 戻るボタン */}
        <button
          className={styles.backButton}
          onClick={() => navigate('/Projects')}
          title="戻る"
        >
          <ArrowLeft size={24} />
        </button>

        {/* 投稿本体 */}
        <div className={styles.projectBox}>
          <div className={styles.authorHeader}>
            <div>
              <div className={styles.authorName}>{project.UserID}</div>
              <div className={styles.roomInfo}>
              </div>
              <div className={styles.timestamp}>{project.CreateDate.slice(0, 16).replace("T"," ")}</div>
            </div>
          </div>

          <div className={styles.content}>
            {project.Content}
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <Coins size={20} />
              <span>受け取った通貨: {project.TotalAmount ?? 0}</span>
            </div>
            <div className={styles.stat}>
              <span>応援: {project.TxCount ?? 0} 件</span>
            </div>
          </div>
        </div>

        {/* 送金履歴セクション */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>応援履歴</h2>
          <div className={styles.transactionsList}>
            {projectDetails && projectDetails.length > 0 ? (
              projectDetails.map((tx) => (
                <div key={tx.TxID} className={styles.transactionItem}>
                  <div className={styles.txContent}>
                    <div className={styles.senderName}>{tx.fromUserID}</div>
                    <div className={styles.txTime}>{tx.Date}</div>
                  </div>
                  <div className={styles.txAmount}>+{tx.Amount}</div>
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
              name="Password"
              type="password"
              placeholder="パスワードを入力"
              required
            />
            <TextInput
              name="Amount"
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
