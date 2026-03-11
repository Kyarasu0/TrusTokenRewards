import React from 'react';
import styles from './PrimaryButton.module.css';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

/**
 * 汎用的なプライマリーボタン。全幅で表示され、ホバー時に少し浮き上がる
 * シンプルなアニメーションを持つ。
 *
 * 小さな "Atom" コンポーネントとして定義し、フォームやカードなど
 * 様々な箇所で再利用できます。
 */
export default function PrimaryButton({ children, className = '', ...rest }: Props) {
  return (
    <button className={`${styles.primary} ${className}`} {...rest}>
      {children}
    </button>
  );
}
