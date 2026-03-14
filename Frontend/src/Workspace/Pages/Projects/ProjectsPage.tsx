import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Header from '../../Components/organisms/Header/Header';
import ProjectCard from '../../Components/organisms/ProjectCard/ProjectCard';
import PrimaryButton from '../../Components/atoms/Button/PrimaryButton';
import styles from './ProjectsPage.module.css';
import { useParams } from "react-router-dom";
import { useEffect } from 'react';
import { useState } from 'react';

interface Props {
  showToast: (msg: string) => void;
  onLogout: () => void;
}

export default function ProjectsPage({ showToast, onLogout }: Props) {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);

  const { RoomName } = useParams();

  useEffect(() => {
    async function fetchProjects(){
      try {
        const res = await fetch(`/Rooms?roomName=${RoomName}`, {
          method: "GET",
          credentials: "include",
        })
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setProjects(data.ProjectList ?? []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }
    fetchProjects();
  }, [RoomName]);

  // 投稿をクリックして詳細画面へ遷移
  const handleSelectProject = (project: any) => {
    navigate(`/Rooms/${RoomName}/${project.ProjectsID}`);
  };

  /**
   * 成果作成
   */
  const handleCreateProject = () => {
    navigate('/CreateProject', { state: { roomName: RoomName ?? '' } });
  };

  return (
    <>
      <Header onLogout={onLogout} showToast={showToast} />

      <main className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{RoomName} の成果</h1>
          <p className={styles.subtitle}>
            チームメンバーの素晴らしい成果をシェアしよう。
            <br />
            いいね（トークン）でサポートしましょう。
          </p>
        </div>

        {/* 投稿作成 */}
        <div className={styles.createButtonContainer}>
          <PrimaryButton onClick={handleCreateProject}>
            <Plus size={18} />
            <span>成果を投稿する</span>
          </PrimaryButton>
        </div>

        {/* 成果一覧 */}
        <div className={styles.projectsList}>
          {projects.map((project) => (
            <ProjectCard
              key={project.ProjectsID}
              project={project}
              onClick={() => handleSelectProject(project)}
            />
          ))}
        </div>
      </main>
    </>
  );
}