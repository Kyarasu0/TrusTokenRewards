import React from 'react';
import styles from './IconButton.module.css';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

/**
 * 小さな丸型のアイコンボタン。
 * ヘッダーのアクションやログアウトボタンなどに使われる
 * "Atom" コンポーネントです。
 */
export default function IconButton({ children, className = '', style, ...rest }: Props) {
  return (
    <button className={`${styles.button} ${className}`} style={style} {...rest}>
      {children}
    </button>
  );
}
