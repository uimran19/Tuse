import { useNavigate } from "react-router-dom";
import { getInspirationMetaData } from "../api";
import Tile from "./Tile";
import { useEffect, useState } from "react";
import { createRoomId } from "../../utils";
import { socket } from "../socket";

export default function InspirationTile({ date, label }) {
  const [inspiration, setInspiration] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getInspirationMetaData(date).then(({ inspiration }) => {
      setInspiration(inspiration);
    });
  }, []);

  function handleCreateInspirationRoom() {
    const newRoomId = createRoomId();
    socket.emit("createRoomRequest", newRoomId);
    navigate(`/canvas/${newRoomId}`, { state: inspiration });
  }

  let {
    title = null,
    artist = null,
    medium = null,
    thumbnailUrl = null,
    imageUrl = null,
  } = inspiration;

  return (
    <Tile
      src={thumbnailUrl}
      label={label}
      alt={`${title}\n${artist}\n${medium}`}
      onClick={() => {
        handleCreateInspirationRoom();
      }}
    />
  );
}
