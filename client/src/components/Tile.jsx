import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { tileStyling } from "./classes";

const StyledTile = styled.button`
  ${(props) => tileStyling(props)}
`;

const StyledTileImage = styled.img`
  ${(props) =>
    props?.$src
      ? `background: url(${props.$src})`
      : `background-color: var(--canvas-color)`};
  height: 100%;
  width: 100%;
  border: none;
`;

const StyledTileLabel = styled.label`
  display: block;
  white-space: pre-line;
  position: absolute;
  border-radius: 0.5em;
  width: max-content;
  max-width: 90%;
  max-height: 90%;
  overflow: hidden;
  pointer-events: none;
  transition: all 235ms ease-in-out;
  color: var(--text-color-dark);
  background-color: var(--label-background-color);
  box-shadow: 0 0 5px 5px var(--label-background-color);

  & p {
    margin: 0;
  }
`;

export default function Tile({
  children,
  as,
  url,
  src,
  label,
  alt,
  onClick,
  onSubmit,
  className,
}) {
  const navigate = useNavigate();

  return (
    <StyledTile
      as={as}
      $displayLabel={label}
      $displayAlt={alt}
      onClick={onClick}
      onSubmit={onSubmit}
      className={className}
    >
      {children}
      <StyledTileImage $src={src} />
      <StyledTileLabel>
        {label ? <p className="main-label">{label}</p> : <></>}
        {alt || label ? <p className="alt-label">{alt || label}</p> : <></>}
      </StyledTileLabel>
    </StyledTile>
  );
}
