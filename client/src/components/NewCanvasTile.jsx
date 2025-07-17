import Tile from "./Tile";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";
import { createRoomId } from "../../utils";

export default function NewCanvasTile() {
  const navigate = useNavigate();

  function handleCreateRoomClick() {
    const newRoomId = createRoomId();
    socket.emit("createRoomRequest", newRoomId);
    navigate(`/canvas/${newRoomId}`);
  }

  return (
    <Tile
      label="Start a new canvas"
      onClick={() => {
        handleCreateRoomClick();
      }}
    ></Tile>
  );
}
