import styled from "styled-components";
import TileRow from "./TileRow";
import Tile from "./Tile";
import { getNDates } from "../../utils";
import InspirationTile from "./InspirationTile";

const StyledHomePage = styled.main`
  width: 100%;
  background-color: var(--page-color);
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
`;

const StyledDivider = styled.h2`
  width: 100%;
  color: var(--text-color-dark);
`;

export default function HomePage() {
  const last7Dates = getNDates(-5);

  return (
    <StyledHomePage>
      <TileRow>
        <Tile url="" label="Jump back in" alt="2000-01-01" />
        <Tile label="Start a new canvas" />
        <Tile></Tile>
        <InspirationTile date={last7Dates[0][1]} label="Today's inspiration" />
      </TileRow>
      <StyledDivider>Previous Daily Inspirations</StyledDivider>
      <TileRow>
        {last7Dates.slice(1).map(([, date]) => {
          return <InspirationTile key={date} date={date} />;
        })}
      </TileRow>
    </StyledHomePage>
  );
}
