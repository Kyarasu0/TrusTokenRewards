import type { RoomData } from "../data/rooms";

export async function getRooms(): Promise<RoomData[]> {
  const res = await fetch("/Home/RoomList");

  if (!res.ok) {
    throw new Error("Failed to fetch rooms");
  }

  return res.json();
}