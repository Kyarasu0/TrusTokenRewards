import { Sparkles } from 'lucide-react';
import styles from './Toast.module.css';

interface Props {
  message: string | null;
}

/**
 * 画面下部にスライドインして表示されるトースト通知。
 * アプリ内のほぼ全ての画面から呼び出されるため、
 * "organisms/layout" 配下に配置しました。
 */
export default function Toast({ message }: Props) {
  return (
    <div className={`${styles.toast} ${message ? styles.show : ''}`}>
      <Sparkles size={18} />
      <span>{message}</span>
    </div>
  );
}
