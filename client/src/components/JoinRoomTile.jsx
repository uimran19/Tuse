import Tile from "./Tile";
import styled from "styled-components";
import { tileStyling } from "./classes";
import JoinRoomForm from "./JoinRoomForm";

const joinRoomFormStyling = (props) => `
  ${tileStyling(props)}
    flex-direction: column;

  & input,
  & button input {
    display: block;
    background-color: var(--canvas-color);
    color: var(--text-color-dark);
    border-radius: 0.5rem;
  }

  & button {
    display: block;
    position: absolute;
    z-index: -1;
    height: calc(var(--tile-size));
    aspect-ratio: 1/1;
    background: var(--canvas-color);
    border: none;
    white-space: pre-line;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: transparent;
  }

  & label {
      display: block;
      color: var(--text-color-dark);
      pointer-events: none;
  }
`;

const StyledJoinRoomTile = styled(JoinRoomForm)`
  ${(props) => joinRoomFormStyling(props)}
`;

export default function JoinRoomTile() {
  return <StyledJoinRoomTile />;
}
