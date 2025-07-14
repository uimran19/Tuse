import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const StyledTile = styled.button`
  --tile-size: 15rem;
  width: var(--tile-size);
  aspect-ratio: 1/1;
  background-color: white;
  margin: 1rem;
  padding: 0;
  color: transparent;

  &:hover {
    color: white;
  }
  }
`;

const StyledTileLabel = styled.label`
  color: inherit;
  position: relative;
  top: calc(0rem - var(--tile-size));
  left: 0;
  pointer-events: none;
`;

const StyledTileImage = styled.img`
  background-color: grey;
  background: url(${(props) => props.$src});
  height: 100%;
  width: 100%;

  &:hover {
    filter: brightness(50%) blur(5px);
`;

export default function Tile({ children, url, src }) {
  const navigate = useNavigate();
  console.log(children);

  return (
    <StyledTile onClick={() => navigate(url)}>
      <StyledTileImage $src={src} />
      <StyledTileLabel>
        <h3>{children?.[0]}</h3>
        <p>
          {children?.slice(1)?.map((child) => {
            return <div>{child}</div>;
          })}
        </p>
      </StyledTileLabel>
    </StyledTile>
  );
}
