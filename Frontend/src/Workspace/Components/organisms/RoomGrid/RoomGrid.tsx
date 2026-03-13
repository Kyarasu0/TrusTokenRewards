import RoomCard from "../RoomCard/RoomCard";
import styles from "./RoomGrid.module.css";
import type { RoomData } from "../../../data/rooms";

interface Props {
  onJoinRoom: (roomName: string) => void;
  rooms?: RoomData[];
}

export default function RoomGrid({ onJoinRoom, rooms }: Props) {

  const displayRooms = rooms ?? [];

  return (
    <div className={styles.grid}>
      {displayRooms.map((room) => (
        <RoomCard
          key={room.roomName}
          room={room}
          onClick={onJoinRoom}
        />
      ))}
    </div>
  );
}