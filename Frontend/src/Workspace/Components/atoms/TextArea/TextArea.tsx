import styles from "./TextArea.module.css";

interface Props {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  name?: string;
  id?: string;
  disabled?: boolean;
}

/**
 * 再利用可能な TextArea コンポーネント
 * value / onChange を受け取る controlled component として設計
 */
export default function TextArea({
  value,
  onChange,
  placeholder,
  required = false,
  rows = 5,
  name,
  id,
  disabled = false
}: Props) {
  return (
    <textarea
      className={styles.textarea}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={rows}
      name={name}
      id={id}
      disabled={disabled}
    />
  );
}