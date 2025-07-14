import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { hoverLiftStyling, peekOutStyling } from "./classes";

const tileStyling = `
  width: var(--tile-size);
  padding: 0;
  border: hidden;
`;

const StyledTile = styled.button`
  --tile-size: 15rem;
  --label-color: var(--text-color-dark);
  --label-background-color: rgba(from var(--canvas-color) r g b / 0.6);
  --label-height: 1.5rem;
  --alt-color: var(--text-color-dark);
  aspect-ratio: 1/1;
  margin: 0.5rem;
  user-select: none;

  ${tileStyling}

  & label p {
    line-height: 2em;
  }
`;

const StyledTileAlt = styled.label`
  background-color: var(--canvas-color);
  color: var(--alt-color);
  width: var(--tile-size);
  position: relative;
  top: calc(0rem - var(--tile-size));
  pointer-events: none;
  width: 100%;
  height: 100%;

  & * {
    background-color: white;
  }
`;

const StyledTileImage = styled.img`
  ${(props) =>
    props?.$src
      ? `background: url(${props.$src})`
      : `background-color: var(--canvas-color)`};
  height: 100%;
  width: 100%;
  border: none;

  ${hoverLiftStyling}

  &:hover ~ * {
    transform: translate(50px, 50px);
  }
`;

const StyledTileLabel = styled.h3`
  height: var(--label-height);
  position: relative;
  top: calc(0rem - (var(--label-height) + var(--tile-size)) / 2);
  text-align: center;
  margin: 0 auto;
  border-radius: 0.5em;
  width: min-contents;
  max-width: 90%;
  color: var(--label-color);
  pointer-events: none;
  background-color: var(--label-background-color);
  text-shadow: 0 0 5px 5px var(--label-background-color);
`;

export default function Tile({ children, url, src, label }) {
  const navigate = useNavigate();

  return (
    <StyledTile onClick={() => navigate(url)}>
      <StyledTileImage $src={src} />
      <StyledTileLabel label={label}>{label}</StyledTileLabel>
      <StyledTileAlt>
        <h4>{children?.[0]}</h4>
        {children?.slice(1)?.map((child, index) => {
          return <p key={index}>{child}</p>;
        })}
      </StyledTileAlt>
    </StyledTile>
  );
}
