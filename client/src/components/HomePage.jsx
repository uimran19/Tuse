import styled from "styled-components";
import TileRow from "./TileRow";
import Tile from "./Tile";

const StyledHomePage = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
`;

export default function HomePage() {
  return (
    <StyledHomePage>
      <TileRow>
        <Tile></Tile>
        <Tile></Tile>
        <Tile></Tile>
      </TileRow>
      <TileRow>
        <Tile></Tile>
        <Tile></Tile>
        <Tile></Tile>
      </TileRow>
    </StyledHomePage>
  );
}
