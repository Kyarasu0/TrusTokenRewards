import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import AuthForm from '../../Components/molecules/AuthForm/AuthForm';

interface Props {
  showToast: (msg: string) => void;
  onLogin?: () => void;
}

export default function LoginPage({ showToast }: Props) {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/Home');
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <AuthForm role={"Login"} onSuccess={handleSuccess} showToast={showToast} />

        <div className={styles.registerLink}>
          <span>アカウントをお持ちでないですか？</span>
          <button onClick={() => navigate('/Register')}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}