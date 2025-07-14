import Tile from "./Tile";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";

export default function NewCanvasTile() {
  const navigate = useNavigate();

  function handleCreateRoomClick(newRoomId) {
    console.log(newRoomId);
    socket.emit("createRoomRequest", newRoomId);
    navigate(`/canvas/${newRoomId}`);
  }

  function createRoomId() {
    function getRandomStringOf4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return getRandomStringOf4() + "-" + getRandomStringOf4();
  }

  return (
    <Tile
      label="Start a new canvas"
      onClick={() => {
        handleCreateRoomClick(createRoomId());
      }}
    ></Tile>
  );
}
