import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { hoverLiftStyling } from "./classes";

const StyledTile = styled.button`
  --tile-size: 15rem;
  display: flex;
  aspect-ratio: 1/1;
  margin: 0.5rem;
  user-select: none;
  width: var(--tile-size);
  padding: 0;
  border: hidden;
  justify-content: center;
  align-items: center;

  --label-background-color: ${(props) =>
    props.$displayLabel
      ? "rgba(from var(--canvas-color) r g b / 0.6)"
      : "transparent"};

  &:hover {
    --label-background-color: ${(props) =>
      props.$displayAlt
        ? "rgba(from var(--canvas-color) r g b / 0.6)"
        : "transparent"};
  }

  ${hoverLiftStyling}

  & label p {
    line-height: 2em;
  }

  & label .alt-label {
    display: none;
  }

  &:hover label .main-label {
    display: none;
  }

  &:hover label .alt-label {
    display: block;
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
  background-color: black;
`;

const StyledTileLabel = styled.label`
  display: block;
  white-space: pre-line;
  position: absolute;
  border-radius: 0.5em;
  width: max-content;
  max-width: 90%;
  pointer-events: none;
  transition: all 235ms ease-in-out;
  color: var(--text-color-dark);
  background-color: var(--label-background-color);
  box-shadow: 0 0 5px 5px var(--label-background-color);
`;

export default function Tile({ url, src, label, alt }) {
  const navigate = useNavigate();

  return (
    <StyledTile
      $displayLabel={label}
      $displayAlt={alt}
      onClick={() => navigate(url)}
    >
      <StyledTileImage $src={src} />
      <StyledTileLabel>
        {label ? <p className="main-label">{label}</p> : <></>}
        {alt ? <p className="alt-label">{alt}</p> : <></>}
      </StyledTileLabel>
    </StyledTile>
  );
}
