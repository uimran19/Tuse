import React, { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import { Link } from "react-router-dom";

const JoinRoomButton = () => {
  const roomIdRef = useRef();
  const [regex, setRegex] = useState("[0-9a-fA-F]{4}-[0-9a-fA-F]{4}");

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    location.href = `../canvas/${roomIdRef.current.value}`;

    // <Link to={`/canvas/${roomIdRef.current.value}`}></Link>;
  };

  return (
    <>
      <form onSubmit={handleJoinSubmit}>
        <label htmlFor="">Room ID: </label>
        <input
          ref={roomIdRef}
          required
          pattern={regex}
          title="Valid room ID format: XXXX-XXXX"
        />
        {/* <button onClick={handleJoinSubmit}>Join</button> */}
        <button type="submit">Join</button>
      </form>
    </>
  );
};

export default JoinRoomButton;
