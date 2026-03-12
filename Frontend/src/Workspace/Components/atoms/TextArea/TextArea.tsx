import styles from "./TextArea.module.css";

interface Props {
  placeholder?: string;
  required?: boolean;
  rows?: number;
}

export default function TextArea({
  placeholder,
  required = false,
  rows = 5
}: Props) {
  return (
    <textarea
      className={styles.textarea}
      placeholder={placeholder}
      required={required}
      rows={rows}
    />
  );
}