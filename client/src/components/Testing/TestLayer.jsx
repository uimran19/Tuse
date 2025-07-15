import { Image, Layer, Stage } from "react-konva";
import useImage from "use-image";

export default function TestLayer() {
  //   const url = "src/assets/brushes/Ink-01.png";
  const url = "https://konvajs.github.io/assets/yoda.jpg";
  const [brushImage] = useImage(url);
  const scale = 5;

  return (
    <Layer>
      <Image
        image={brushImage}
        x={150}
        y={150}
        scale={{ x: scale, y: scale }}
      />
    </Layer>
  );
}

function TestStage() {
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <TestLayer />
    </Stage>
  );
}
