import React, { useEffect, useRef, useState } from "react";
import { socket } from "../socket";

const JoinRoomButton = () => {
  const roomIdRef = useRef();

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    location.href = `http://localhost:5173/canvas/${roomIdRef.current.value}`;
  };

  return (
    <>
      <form>
        <input ref={roomIdRef} />
        <button onClick={handleJoinSubmit}>Join</button>
      </form>
    </>
  );
};

export default JoinRoomButton;
