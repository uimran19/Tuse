import React, { useEffect, useRef, useState } from "react";
import { socket } from "../socket";

const CreateRoomButton = () => {
  const handleCreateRoomClick = (newRoomId) => {
    console.log(newRoomId);
    document.getElementById(
      "new-room-link"
    ).innerHTML = `<a href="../canvas/${newRoomId}">Visit your new room</a>`;
    socket.emit("createRoomRequest", newRoomId);
  };

  const uuid = () => {
    let S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  };

  return (
    <>
      <button onClick={() => handleCreateRoomClick(uuid())}>
        Create drawing room
      </button>
      <div id="new-room-link"></div>
    </>
  );
};

export default CreateRoomButton;
