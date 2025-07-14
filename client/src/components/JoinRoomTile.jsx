import Tile from "./Tile";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import styled from "styled-components";

const StyledInput = styled.input`
  position: absolute;
  background-color: white;
  border-radius: 0.5rem;
`;

const StyledButton = styled.button`
  position: absolute;
  height: calc(var(--tile-size));
  aspect-ratio: 1/1;
  background: none;
  border: none;
`;

export default function JoinRoomTile() {
  const navigate = useNavigate();

  const [roomIdRef, setRoomIdRef] = useState("");
  const [regex, setRegex] = useState("[0-9a-fA-F]{4}-[0-9a-fA-F]{4}");

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    console.log(roomIdRef);
    return navigate(`/canvas/${roomIdRef}`);
  };

  return (
    <Tile
      as="form"
      //   label="Join a room"
      //   alt="Join a room"
      onSubmit={handleJoinSubmit}
    >
      <StyledButton type="submit"></StyledButton>
      <StyledInput
        required
        pattern={regex}
        title="Valid room ID format: XXXX-XXXX"
        placeholder="Join a room"
        value={roomIdRef}
        onChange={(e) => {
          setRoomIdRef(e.target.value);
        }}
        onClick={(e) => e.stopPropagation()}
      />
    </Tile>
  );
}
