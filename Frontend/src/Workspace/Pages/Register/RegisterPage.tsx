import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterPage.module.css';
import AuthForm from '../../Components/molecules/AuthForm/AuthForm';
// 型のインポート
import type { AuthResponse } from '../../Components/molecules/AuthForm/AuthForm'

interface Props {
  showToast: (msg: string) => void;
  onRegister?: () => void;
}

/**
 * ログインページ。ページ固有のレイアウト（中央寄せのカード）
 * を定義し、実際のフォーム部分はAuthFormに委譲しています。
 */
export default function RegisterPage({ showToast }: Props) {
  const navigate = useNavigate();
  const [privateKey, setPrivateKey] = useState("");
  const [copied, setCopied] = useState(false);
  const isRegistered = privateKey !== "";

  const handleSuccess = (data: AuthResponse) => {
    setPrivateKey(data.privateKey || "Not found...");
  };

  const handleCopy = useCallback(() => {
    if (!privateKey) return;
    navigator.clipboard.writeText(privateKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [privateKey]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <AuthForm
          role={"Register"}
          onSuccess={handleSuccess}
          showToast={showToast}
          buttonLabel={isRegistered ? "Home" : undefined}
          onButtonClick={isRegistered ? () => navigate('/Home') : undefined}
        />

        <div className={styles.loginLink}>
          <span>アカウントをお持ちですか？</span>
          <button onClick={() => navigate('/Login')}>
            Login
          </button>
        </div>

        <div className={styles.simpleBox}>
          <span className={styles.keyText}>
            {privateKey || "ここに表示されるものは秘密鍵です。絶対に保存してください。"}
          </span>
          {privateKey && (
            <button
              className={styles.copyButton}
              onClick={handleCopy}
              title="クリップボードにコピー"
            >
              {copied ? "✓ コピー済" : "コピー"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
     
