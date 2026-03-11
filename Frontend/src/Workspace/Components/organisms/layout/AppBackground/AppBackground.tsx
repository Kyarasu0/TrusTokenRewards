import styles from './AppBackground.module.css';

/**
 * 全ページ共通の背景要素を描画するコンポーネント。
 * グラスモーフィズム風のぼやけたオーブを配置して
 * アプリ全体のビジュアル基調を整えます。
 */
export default function AppBackground() {
  return (
    <>
        <div className={styles.background}>
            <div className={styles.container}></div>
            <div className={styles.orb1}></div>
            <div className={styles.orb2}></div>
        </div>
    </>
  );
}
