import { Image, Layer } from "react-konva";
import styled from "styled-components";
import useImage from "use-image";

const StyledLayer = styled(Layer)`
  pointer-events: none;
`;

export default function InspirationLayer({
  inspiration,
  canvasWidth,
  canvasHeight,
}) {
  //   const url = "src/assets/brushes/Ink-01.png";
  const url = inspiration.imageUrl;
  const [brushTexture] = useImage(url);
  const imageSize = 3000;
  const scale = 0.35;

  console.log(inspiration);

  return (
    <Layer>
      <Image
        image={brushTexture}
        x={canvasWidth / 2}
        y={canvasHeight / 2}
        offsetX={(imageSize * scale) / 2}
        offsetY={(imageSize * scale) / 2}
        scale={{ x: scale, y: scale }}
      />
    </Layer>
  );
}
