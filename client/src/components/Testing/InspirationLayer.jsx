import { Image, Layer } from "react-konva";
import styled from "styled-components";
import useImage from "use-image";

const StyledLayer = styled(Layer)``;

export default function InspirationLayer() {
  //   const url = "src/assets/brushes/Ink-01.png";
  const url = "https://konvajs.github.io/assets/yoda.jpg";
  const [brushTexture] = useImage(url);
  const scale = 5;

  return (
    <Layer>
      <Image
        image={brushTexture}
        x={150}
        y={150}
        scale={{ x: scale, y: scale }}
      />
    </Layer>
  );
}
