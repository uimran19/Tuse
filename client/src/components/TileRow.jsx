import styled from "styled-components";

const StyledTileRow = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
`;

export default function TileRow({ children }) {
  return <StyledTileRow>{children}</StyledTileRow>;
}
