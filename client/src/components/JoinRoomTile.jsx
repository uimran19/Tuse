import Tile from "./Tile";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import styled from "styled-components";
import { socket } from "../socket";

const StyledInput = styled.input`
  background-color: var(--canvas-color);
  color: var(--text-color-dark);
  border-radius: 0.5rem;
`;

const StyledButton = styled.button`
  position: absolute;
  height: calc(var(--tile-size));
  aspect-ratio: 1/1;
  background: none;
  border: none;
  white-space: pre-line;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & label {
    display: block;
    color: var(--text-color-dark);
  }
`;

export default function JoinRoomTile() {
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
    <Tile
      as="form"
      //   label="Create a new canvas,"
      //   alt="Join a room"
      onSubmit={handleJoinSubmit}
    >
      <StyledButton type="submit">
        {/* <label>
          {"Create a new canvas...\n \n \n \n ...or join an existing one"}
        </label> */}
        <label>{"Join a room"}</label>
        <StyledInput
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
      </StyledButton>
    </Tile>
  );
}
