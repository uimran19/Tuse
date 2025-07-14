import styled from "styled-components";

const StyledBackgroundImage = styled.img`
  position: fixed;
  z-index: -1;
  top: ${(props) => props.$y};
  left: ${(props) => props.$x};
  width: ${(props) => props.$scale};
  background-color: var(--page-color);
  opacity: 0.5;
`;

const StyledBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: -2;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background-color: var(--page-color);
`;

export default function Background() {
  return (
    <StyledBackground>
      {/* <StyledBackgroundImage
        $x="-20%"
        $y="-30%"
        $scale={"40%"}
        src={paintSplat1}
      /> */}
    </StyledBackground>
  );
}
