import React from 'react';
import styles from './TextInput.module.css';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

/**
 * ラベルなしのテキスト入力。プレースホルダーで指示を出すスタイル。
 * アイコンを左側に差し込むこともできるため、パスワードやメール入力
 * などで視認性を高めることができます。
 */
export default function TextInput({ icon, className = '', ...rest }: Props) {
  return (
    <div className={`${styles.group} ${className}`}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <input className={`${styles.input} ${icon ? styles.withIcon : styles.noIcon}`} {...rest} />
    </div>
  );
}
