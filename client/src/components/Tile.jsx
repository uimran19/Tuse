import styled from "styled-components";

const StyledTile = styled.button`
  width: 15rem;
  aspect-ratio: 1/1;
  background-color: white;
  margin: 1rem;
`;

export default function Tile({ children }) {
  return <StyledTile>{children}</StyledTile>;
}
