import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Coins } from 'lucide-react';

import Header from '../../Components/organisms/Header/Header';
import PrimaryButton from '../../Components/atoms/Button/PrimaryButton';
import TextInput from '../../Components/atoms/Input/TextInput';

import { getProjectDetail } from '../../Functions/GetProjectDetail';

import type { ProjectDetailData } from '../../data/projects';

import styles from './ProjectDetailPage.module.css';

interface Props {
  showToast: (msg: string) => void;
  onLogout: () => void;
}

export default function ProjectDetailPage({ showToast, onLogout }: Props) {

  const navigate = useNavigate();
  const { RoomName, ProjectID } = useParams();

  const [project, setProject] = useState<ProjectDetailData | null>(null);

  useEffect(() => {

    const load = async () => {

      try {

        if (!RoomName || !ProjectID) return;

        const data = await getProjectDetail(RoomName, Number(ProjectID));

        setProject(data);

      } catch {

        showToast("投稿取得に失敗しました");

      }

    };

    load();

  }, [RoomName, ProjectID]);


  if (!project) {
    return (
      <>
        <Header onLogout={onLogout} showToast={showToast} />
        <div style={{ padding: "40px" }}>投稿を読み込み中...</div>
      </>
    );
  }

  const handleSendToken = (e: React.FormEvent) => {

    e.preventDefault();

    showToast("トークン送信機能は次で実装");

  };

  return (
    <>
      <Header onLogout={onLogout} showToast={showToast} />

      <main className={styles.container}>

        {/* 戻る */}
        <button
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={24} />
        </button>

        {/* 投稿 */}
        <div className={styles.projectBox}>

          <div className={styles.authorHeader}>

            <div>
              <div className={styles.authorName}>
                {project.authorName}
              </div>

              <div className={styles.roomInfo}>
                {project.roomName}
              </div>

              <div className={styles.timestamp}>
                {project.timestamp}
              </div>
            </div>

          </div>

          <div className={styles.content}>
            {project.content}
          </div>

          <div className={styles.stats}>

            <div className={styles.stat}>
              <Coins size={20}/>
              <span>受け取った通貨: {project.totalReceived}</span>
            </div>

            <div className={styles.stat}>
              <span>応援: {project.transactions.length} 件</span>
            </div>

          </div>

        </div>

        {/* 送金履歴 */}
        <div className={styles.section}>

          <h2 className={styles.sectionTitle}>
            応援履歴
          </h2>

          <div className={styles.transactionsList}>

            {project.transactions.length === 0 && (
              <div className={styles.noTransactions}>
                まだ応援がありません
              </div>
            )}

            {project.transactions.map(tx => (

              <div key={tx.id} className={styles.transactionItem}>

                <div className={styles.txContent}>

                  <div className={styles.senderName}>
                    {tx.senderName}
                  </div>

                  <div className={styles.txTime}>
                    {tx.timestamp}
                  </div>

                  <div>
                    {tx.content}
                  </div>

                </div>

                <div className={styles.txAmount}>
                  +{tx.amount}
                </div>

              </div>

            ))}

          </div>

        </div>

        {/* トークン送信 */}
        <div className={styles.section}>

          <h2 className={styles.sectionTitle}>
            応援を送る
          </h2>

          <form onSubmit={handleSendToken} className={styles.form}>

            <TextInput
              type="password"
              placeholder="パスワード"
              required
            />

            <TextInput
              type="number"
              placeholder="送金量"
              min="1"
              required
            />

            <PrimaryButton type="submit">
              <Coins size={18}/>
              <span>トークン送信</span>
            </PrimaryButton>

          </form>

        </div>

      </main>
    </>
  );
}