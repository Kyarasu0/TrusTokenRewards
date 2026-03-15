import { Coins } from 'lucide-react';
import styles from './ProjectCard.module.css';

interface ProjectCardData {
  ProjectID: string;
  UserID: string;
  CreateDate: string;
  Content: string;
  TotalAmount: number | null;
  TxCount: number;
}

interface Props {
  project: ProjectCardData;
  onClick: () => void;
}

/**
 * ProjectCard コンポーネント
 * 投稿（成果）を表示するカード。Twitter のツイートのようなデザイン。
 * クリックすると投稿の詳細画面に遷移します。
 */
export default function ProjectCard({ project, onClick }: Props) {
  return (
    <div className={styles.card} onClick={onClick}>
      {/* ヘッダー：投稿者とルーム情報 */}
      <div className={styles.header}>
        <div>
          <div className={styles.UserID}>{project.UserID}</div>
          <div className={styles.roomInfo}>
            {project.CreateDate.slice(0, 16).replace("T"," ")}
          </div>
        </div>
      </div>

      {/* コンテンツ：投稿本文 */}
      <div className={styles.content}>
        {project.Content}
      </div>

      {/* フッター：受信した通貨情報 */}
      <div className={styles.footer}>
        <div className={styles.coinBadge}>
          <Coins size={16} />
          <span>{project.TotalAmount ?? 0}</span>
        </div>
        <div className={styles.transactionCount}>
          {project.TxCount} 件の応援
        </div>
      </div>
    </div>
  );
}
