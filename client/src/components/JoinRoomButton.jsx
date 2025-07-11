import React, { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import { Link } from "react-router-dom";

const JoinRoomButton = () => {
  const roomIdRef = useRef();

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    // location.href = `../canvas/${roomIdRef.current.value}`;

    <Link to={`/canvas/${roomIdRef.current.value}`}></Link>;
  };

  return (
    <>
      <form>
        <label htmlFor="">Room ID: </label>
        <input ref={roomIdRef} />
        <button onClick={handleJoinSubmit}>Join</button>
      </form>
    </>
  );
};

export default JoinRoomButton;
