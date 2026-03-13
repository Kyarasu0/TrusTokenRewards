import type { ProjectDetailData } from "../data/projects";

export async function getProjectDetail(
  roomName: string,
  projectID: number
): Promise<ProjectDetailData> {

  const res = await fetch(`/Rooms/${roomName}/${projectID}`);

  if (!res.ok) {
    throw new Error("Failed to fetch project detail");
  }

  const data = await res.json();

  const project = data.project;

  return {
    id: project.id,
    authorName: project.authorName,
    roomName: project.roomName,
    content: project.content,
    timestamp: project.timestamp,
    totalReceived: project.totalReceived,

    transactions: (project.transactions ?? []).map((tx: any) => ({
      id: tx.id,
      senderName: tx.senderName,
      content: tx.content,
      timestamp: tx.timestamp,
      amount: tx.amount,
      txID: tx.txID
    }))
  };
}