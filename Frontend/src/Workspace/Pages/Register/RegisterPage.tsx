import { useState } from 'react';
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

  const handleSuccess = (data: AuthResponse) => {
    setPrivateKey(data.privateKey || "Not found...");
    navigate('/Login');
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <AuthForm role={"Register"} onSuccess={handleSuccess} showToast={showToast} />

        <div className={styles.loginLink}>
          <span>アカウントをお持ちですか？</span>
          <button onClick={() => navigate('/Login')}>
            Login
          </button>
        </div>

        <div className={styles.simpleBox}>
          {privateKey || "ここに表示されるものは秘密鍵です。絶対に保存してください。"}
        </div>
      </div>
    </div>
  );
}
