import { User, Coins } from 'lucide-react';
import { useFadeInUp } from '../../../hooks/useFadeInUp';
import fadeStyles from '../../atoms/Animation/FadeInUp.module.css';
import styles from './RoomCard.module.css';
import type { RoomData } from '../../../data/rooms';

interface Props {
  room: RoomData;
  onClick: (name: string) => void;
}

/**
 * 一つのルーム（組織）をカードとして表現する "Organism"。
 * グリッド内で等間隔に並べられるよう高さや内部余白を調整し、
 * ホバー時のアニメーションも仕込んであります。
 */
export default function RoomCard({ room, onClick }: Props) {
  const { ref, isVisible } = useFadeInUp();

  return (
    <div
      ref={ref}
      className={`${styles.card} ${fadeStyles.fadeInUp} ${
        isVisible ? fadeStyles.visible : ''
      }`}
      onClick={() => onClick(room.name)}
    >
      <div className={styles.largeIcon}>{room.icon}</div>
      <h3 className={styles.title}>{room.name}</h3>
      <p className={styles.desc}>{room.description}</p>

      <div className={styles.footer}>
        <div className={styles.stats}>
          <div className={styles.badge}>
            <User size={16} />
            <span>{room.members}</span>
          </div>
        </div>
        <div
          className={styles.badge}
          style={{ color: '#d97706', background: 'rgba(245, 158, 11, 0.1)', padding: '6px 12px', borderRadius: '12px' }}
        >
          <Coins size={16} />
          <span>{room.totalCoins.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
