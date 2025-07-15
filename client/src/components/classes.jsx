export const hoverLiftStyling = `
  box-shadow: rgba(0, 0, 0, .3) 2px 8px 8px -5px;
  cursor: pointer;
  transition: all 235ms ease-in-out;
  -webkit-user-select: none;
  touch-action: manipulation;

  &:hover {
    transform: translate3d(0, -5px, 0) rotate(0.5deg) scale(1.05);
  box-shadow: rgba(0, 0, 0, .2) 15px 28px 25px -18px;
  }
`;

const fonts = {
  rockSaltRegular: `
    font-family: "Rock Salt", cursive;
    font-weight: 400;
    font-style: normal;
  `,
  homemadeAppleRegular: `
    font-family: "Homemade Apple", cursive;
    font-weight: 400;
    font-style: normal;
  `,
  protestRevolutionRegular: `
  font-family: "Protest Revolution", sans-serif;
  font-weight: 400;
  font-style: normal;
  `,
  lacquerRegular: `
  font-family: "Lacquer", system-ui;
  font-weight: 400;
  font-style: normal;
  `,
};

export const titleFont = `${fonts.protestRevolutionRegular}
  font-size: xxx-large;
`;
export const subTitleFont = `${fonts.rockSaltRegular}
  font-size: large;
`;
export const notesFont = `${fonts.rockSaltRegular}
  font-size: small;
`;

export const tileStyling = (props) => {
  return `
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

  --label-background-color: ${
    props.$displayLabel
      ? "rgba(from var(--canvas-color) r g b / 0.6)"
      : "transparent"
  };

  &:hover {
    --label-background-color: ${
      props.$displayAlt
        ? "rgba(from var(--canvas-color) r g b / 0.6)"
        : "transparent"
    };
  }

  ${hoverLiftStyling}

  & label {
    line-height: 2em;
    ${subTitleFont}
  }

  & label .alt-label {
    display: none;
    ${props.$displayAlt ? notesFont : subTitleFont}
  }

  &:hover label .main-label {
    display: none;
  }

  &:hover label .alt-label {
    display: block;
  }
`;
};
