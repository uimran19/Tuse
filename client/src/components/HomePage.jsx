import styled from "styled-components";
import TileRow from "./TileRow";
import Tile from "./Tile";
import { getNDates } from "../../utils";
import InspirationTile from "./InspirationTile";
import NewCanvasTile from "./NewCanvasTile";
import JoinRoomTile from "./JoinRoomTile";
import { titleFont } from "./classes";
import Background from "./Background";

const StyledHomePage = styled.main`
  width: 100%;
  position: relative;
  top: var(--header-height);
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;

  ${titleFont}
`;

const StyledDivider = styled.h2`
  width: 100%;
  color: var(--text-color-dark);
  margin: 0.2em 0;
  ${titleFont}
`;

export default function HomePage() {
  const last7Dates = getNDates(-5);

  return (
    <>
      {/* <Header /> */}
      <Background />
      <StyledHomePage>
        <TileRow>
          <Tile url="" label="Jump back in" alt="2000-01-01" />
          <NewCanvasTile />
          {/* <JoinRoomTile /> */}
          <InspirationTile
            date={last7Dates[0][1]}
            label="Today's inspiration"
          />
        </TileRow>
        <StyledDivider>Previous Daily Inspirations</StyledDivider>
        <TileRow>
          {last7Dates.slice(1).map(([, date]) => {
            return <InspirationTile key={date} date={date} />;
          })}
        </TileRow>
      </StyledHomePage>
    </>
  );
}
