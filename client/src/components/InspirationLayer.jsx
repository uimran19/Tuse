import { Image, Layer } from "react-konva";
import styled from "styled-components";
import useImage from "use-image";

const StyledLayer = styled(Layer)`
  pointer-events: none;
`;

export default function InspirationLayer({ inspiration, canvasWidth }) {
  const url = inspiration.imageUrl;
  const [brushTexture] = useImage(url);
  const imageSize = 1686;
  const scale = 0.5;

  return (
    <Layer>
      <Image
        image={brushTexture}
        x={canvasWidth / 2}
        y={120}
        offsetX={(imageSize * scale) / 2}
        scale={{ x: scale, y: scale }}
      />
    </Layer>
  );
}
