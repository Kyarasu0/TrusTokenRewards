import { ShieldCheck, Bell, User, LogOut } from 'lucide-react';
import { useNavigate } from "react-router-dom";

import IconButton from '../../atoms/IconButton/IconButton';
import styles from './Header.module.css';

interface Props {
  onLogout: () => void;
  showToast: (msg: string) => void;
}

export default function Header({ onLogout, showToast }: Props) {

  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div
        className={styles.logo}
        onClick={() => navigate("/home")}
        style={{ cursor: "pointer" }}
      >
        <ShieldCheck color="#1d1d1f" size={28} />
        <span>TrusTokenRewards</span>
      </div>

      <div className={styles.actions}>
        <IconButton onClick={() => showToast('通知はありません')}>
          <Bell size={18} />
        </IconButton>

        <IconButton onClick={() => showToast('プロフィール設定を開きます')}>
          <User size={18} />
        </IconButton>

        <IconButton
          onClick={onLogout}
          style={{
            background: '#ffeeee',
            color: '#e63946',
            borderColor: 'rgba(230,57,70,0.2)'
          }}
        >
          <LogOut size={18} />
        </IconButton>
      </div>
    </header>
  );
}