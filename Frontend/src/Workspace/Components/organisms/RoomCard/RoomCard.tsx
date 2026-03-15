import { User, Coins } from 'lucide-react';
import { useFadeInUp } from '../../../hooks/useFadeInUp';
import fadeStyles from '../../atoms/Animation/FadeInUp.module.css';
import styles from './RoomCard.module.css';
import type { RoomData } from '../../../data/rooms';
import defaultImage from '../../../../../public/Images/image.png';

interface Props {
  room: RoomData;
  onClick: (name: string) => void;
}

export default function RoomCard({ room, onClick }: Props) {
  const { ref, isVisible } = useFadeInUp();

  return (
    <div
      ref={ref}
      className={`${styles.card} ${fadeStyles.fadeInUp} ${
        isVisible ? fadeStyles.visible : ''
      }`}
      onClick={() => onClick(room.roomName)}
    >
      <div className={styles.largeIcon}>
        <img
          src={room.roomIconPath ? `http://localhost:5000${room.roomIconPath}` : defaultImage}
          alt={room.roomName}
          className={styles.image}
        />
      </div>

      <h3 className={styles.title}>{room.roomName}</h3>

      <div className={styles.footer}>
        <div className={styles.stats}>
          <div className={styles.badge}>
            <User size={16} />
            <span>{room.members}</span>
          </div>
        </div>

        <div
          className={styles.badge}
          style={{
            color: '#d97706',
            background: 'rgba(245, 158, 11, 0.1)',
            padding: '6px 12px',
            borderRadius: '12px'
          }}
        >
          <Coins size={16} />
          <span>{room.balance.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}