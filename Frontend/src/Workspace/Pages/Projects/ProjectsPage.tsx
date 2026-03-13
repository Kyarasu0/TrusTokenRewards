import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import Header from "../../Components/organisms/Header/Header";
import ProjectCard from "../../Components/organisms/ProjectCard/ProjectCard";
import PrimaryButton from "../../Components/atoms/Button/PrimaryButton";

import { getProjects } from "../../Functions/GetProjects";
import type { ProjectData } from "../../data/rooms";

import styles from "./ProjectsPage.module.css";

interface Props {
  showToast: (msg: string) => void;
  onLogout: () => void;
}

export default function ProjectsPage({ showToast, onLogout }: Props) {
  const navigate = useNavigate();
  const { RoomName } = useParams();

  const [projects, setProjects] = useState<ProjectData[]>();

  /**
   * ページ表示時に成果一覧取得
   */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!RoomName) return;

        const data = await getProjects(RoomName);
        setProjects(data);

      } catch {
        console.warn("API取得失敗 → モック使用");
      }
    };

    fetchProjects();
  }, [RoomName]);

  /**
   * 成果クリック → 詳細
   */
  const handleSelectProject = (project: ProjectData) => {
    navigate(`/Rooms/${RoomName}/${project.id}`, { state: { project } });
  };

  /**
   * 成果作成
   */
  const handleCreateProject = () => {
    navigate(`/Rooms/${RoomName}/CreateProject`);
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
          {projects?.map((project) => (
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