import RoomCard from "../RoomCard/RoomCard";
import styles from "./RoomGrid.module.css";
import type { RoomData } from "../../../data/rooms";
import { ROOM_DATA } from "../../../data/rooms";

interface Props {
  onJoinRoom: (roomName: string) => void;
  rooms?: RoomData[];
}

export default function RoomGrid({ onJoinRoom, rooms }: Props) {

  const displayRooms = rooms && rooms.length > 0 ? rooms : ROOM_DATA;

  return (
    <div className={styles.grid}>
      {displayRooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          onClick={onJoinRoom}
        />
      ))}
    </div>
  );
}