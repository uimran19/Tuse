import styled from "styled-components";
import { subTitleFont, titleFont } from "./classes";
import JoinRoomForm from "./JoinRoomForm";
import { useNavigate } from "react-router-dom";

const StyledHeader = styled.header`
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: var(--dark);
  height: var(--header-height);

  & button {
  }

  & #home-button {
    background: linear-gradient(to right, red, blue, green, yellow);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    border: none;
    margin: 0;
    padding: 0;
    ${titleFont}
    font-size: xxx-large;
    height: max-content;
    width: max-content;
  }
`;

const StyledJoinRoomForm = styled(JoinRoomForm)`
  ${subTitleFont}
  display: flex;

  & * {
    margin: 0 0.5rem;
  }

  & button {
    padding: 0 0.5rem;
    font-family: inherit;
  }

  & label {
    display: none;
  }
`;

export default function Header() {
  const navigate = useNavigate();
  return (
    <StyledHeader>
      <button id="home-button" onClick={() => navigate("/")}>
        Tuse
      </button>
      <StyledJoinRoomForm />
    </StyledHeader>
  );
}
