import React, { useEffect, useRef, useState } from "react";
import { socket } from "../socket";

const JoinRoomButton = () => {
  const [roomIdInput, setroomIdInput] = useState();

  const handleChange = (e) => {
    setroomIdInput(e.target.value);
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    location.href = `http://localhost:5173/canvas/${roomIdInput}`;
  };

  return (
    <>
      <form>
        <input onChange={handleChange} value={roomIdInput} />
        <button onClick={handleJoinSubmit}>Join</button>
      </form>
    </>
  );
};

export default JoinRoomButton;
