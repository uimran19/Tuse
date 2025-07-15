import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function JoinRoomForm({ className }) {
  const navigate = useNavigate();

  const [roomIdRef, setRoomIdRef] = useState("");
  const [regex, setRegex] = useState("[0-9a-fA-F]{4}-[0-9a-fA-F]{4}");

  //   function createRoomId() {
  //     function getRandomStringOf4() {
  //       return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  //     }
  //     return getRandomStringOf4() + "-" + getRandomStringOf4();
  //   }

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (roomIdRef) {
      navigate(`/canvas/${roomIdRef}`);
      // } else {
      //   const newRoomId = createRoomId();
      //   socket.emit("createRoomRequest", newRoomId);
      //   navigate(`/canvas/${newRoomId}`);
    }
  };

  return (
    <form
      className={className}
      //   label="Create a new canvas,"
      //   alt="Join a room"
      onSubmit={handleJoinSubmit}
    >
      <label>{"Join a room"}</label>
      <input
        required
        pattern={regex}
        title="Valid room ID format: XXXX-XXXX"
        placeholder="Room ID: XXXX-XXXX"
        value={roomIdRef}
        onChange={(e) => {
          setRoomIdRef(e.target.value);
        }}
        onClick={(e) => e.stopPropagation()}
      />
      <button type="submit">
        Join a room
        {/* <label>
          {"Create a new canvas...\n \n \n \n ...or join an existing one"}
        </label> */}
      </button>
    </form>
  );
}
