import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PROJECT_DATA } from '../../data/rooms';
import type { ProjectData } from '../../data/rooms';
import Header from '../../Components/organisms/Header/Header';
import ProjectCard from '../../Components/organisms/ProjectCard/ProjectCard';
import PrimaryButton from '../../Components/atoms/Button/PrimaryButton';
import styles from './ProjectsPage.module.css';

interface Props {
  showToast: (msg: string) => void;
  onLogout: () => void;
}

/**
 * Projects ページ
 * 投稿（成果）がTwitter風に表示される画面。
 * タップするとプロジェクト詳細画面に遷移します。
 */
export default function ProjectsPage({ showToast, onLogout }: Props) {
  const navigate = useNavigate();

  // 投稿をクリックして詳細画面へ遷移
  const handleSelectProject = (project: ProjectData) => {
    navigate(`/Projects/${project.id}`, { state: { project } });
  };

  // 投稿作成画面へ遷移（後で実装）
  const handleCreateProject = () => {
    showToast('投稿作成画面へ遷移します');
    // navigate('/projects/create');
  };

  return (
    <>
      <Header onLogout={onLogout} showToast={showToast} />

      <main className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>成果と感謝</h1>
          <p className={styles.subtitle}>
            チームメンバーの素晴らしい成果をシェアしよう。
            <br />
            いいね（トークン）でサポートしましょう。
          </p>
        </div>

        {/* 投稿作成ボタン */}
        <div className={styles.createButtonContainer}>
          <PrimaryButton onClick={handleCreateProject}>
            <Plus size={18} />
            <span>成果を投稿する</span>
          </PrimaryButton>
        </div>

        {/* 投稿一覧 */}
        <div className={styles.projectsList}>
          {PROJECT_DATA.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleSelectProject(project)}
            />
          ))}
        </div>
      </main>
    </>
  );
}
