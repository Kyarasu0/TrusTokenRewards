import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import TextInput from '../../atoms/Input/TextInput';
import PrimaryButton from '../../atoms/Button/PrimaryButton';
import { useFadeInUp } from '../../../hooks/useFadeInUp';
import fadeStyles from '../../atoms/Animation/FadeInUp.module.css';
import styles from './AuthForm.module.css';
// 関数のインポート
import { Submit } from './../../../Functions/Submit';

export interface AuthResponse {
  message: string;
  privateKey: string | null;
}

interface Props {
    address?: string;
    role: string;
    onSuccess: (data: AuthResponse) => void;
    showToast: (msg: string) => void;
}

/*
ログイン/新規登録フォーム部分。
モジュール形式に分けることで、他ページでもフォーム部分だけを
再利用しやすくしています（例えば別の認証ワークフローなど）。
 */
export default function AuthForm({ onSuccess, showToast, role}: Props) {
  const { ref, isVisible } = useFadeInUp();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    // HTMLのSubmit後の自動リロードを止める
    e.preventDefault();

    try {
        const data = await Submit(`/${role}/Submit`, userId, password, showToast);

        showToast(`${role} successful!`);
        onSuccess(data);

    } catch (err: any) {
        showToast(err.message);
    }
};

  return (
    <div
      ref={ref}
      className={`${styles.container} ${fadeStyles.fadeInUp} ${
        isVisible ? fadeStyles.visible : ''
      }`}
    >
      <div className={styles.logo}>
        <ShieldCheck size={36} />
      </div>
      <h2 className={styles.title}>TrusTokenRewards</h2>
      <p className={styles.desc}>
        仕事の価値を、目に見える形へ。
        <br />あなたの貢献に対する「感謝」と「信頼」を
        <br />トークンとして受け取りましょう。
      </p>

      <form style={{ width: '100%' }} onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="UserID"
          required
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          icon={<User size={20} />}
        />
        <TextInput
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock size={20} />}
        />

        <PrimaryButton type="submit">
          <span>{role}</span>
          <ArrowRight size={18} />
        </PrimaryButton>
      </form>
    </div>
  );
}
