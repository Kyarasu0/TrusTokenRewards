import { Coins } from 'lucide-react';
import type { ProjectData } from '../../../data/rooms';
import styles from './ProjectCard.module.css';

interface Props {
  project: ProjectData;
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
          <div className={styles.authorName}>{project.authorName}</div>
          <div className={styles.roomInfo}>
            {project.roomName} • {project.timestamp}
          </div>
        </div>
      </div>

      {/* コンテンツ：投稿本文 */}
      <div className={styles.content}>
        {project.content}
      </div>

      {/* フッター：受信した通貨情報 */}
      <div className={styles.footer}>
        <div className={styles.coinBadge}>
          <Coins size={16} />
          <span>{project.totalReceived}</span>
        </div>
        <div className={styles.transactionCount}>
          {project.transactions?.length ?? 0} 件の応援
        </div>
      </div>
    </div>
  );
}
