import type { ProjectData } from "../data/rooms";

export async function getProjects(roomName: string): Promise<ProjectData[]> {

  const res = await fetch(`/Rooms/${roomName}/ProjectList`);

  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }

  const data = await res.json();

  return data.resultList.map((project: any) => ({
    id: project.projectsID,
    userId: project.userID,
    content: project.content
  }));
}