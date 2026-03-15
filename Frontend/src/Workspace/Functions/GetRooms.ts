import type { RoomData } from "../data/rooms";

export async function getRooms(): Promise<RoomData[]> {
  const res = await fetch("/Home/RoomList");

  if (!res.ok) {
    throw new Error("Failed to fetch rooms");
  }

  const data = await res.json();

  return data.resultList.map((room: any) => ({
    roomName: room.roomName,
    roomIconPath: room.roomIconPath,
    members: room.roomHeadcount?.[0]?.["Count(*)"] ?? 0,
    balance: room.balance
  }));
}