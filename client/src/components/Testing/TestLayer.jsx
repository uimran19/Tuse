import { Image, Layer, Stage } from "react-konva";
import useImage from "use-image";

export default function TestLayer({ lines, liveLine }) {
  //   const url = "src/assets/brushes/Ink-01.png";
  const url = "https://konvajs.github.io/assets/yoda.jpg";
  const [brushImage] = useImage(url);
  const scale = 5;

  function drawLines(lines) {
    const brushStrokes = lines.filter((line) => {
      return line.tool === "brush";
    });
    if (brushStrokes?.[0]?.points) {
      return brushStrokes.map((line, i) => {
        const { strokeWidth, opacity, colour } = line;
        const rgb = [
          Number("0x" + colour.slice(1, 3)),
          Number("0x" + colour.slice(3, 5)),
          Number("0x" + colour.slice(5)),
        ];
        const points = line.points;
        const pointsGrouped = [];
        for (let i = 0; i < points.length; i += 2) {
          pointsGrouped.push([points[i], points[i + 1]]);
        }
        return pointsGrouped.map((point, j) => {
          const [x, y] = point;
          return (
            <Image
              key={`${i}.${j}`}
              image={brushImage}
              height={strokeWidth}
              width={strokeWidth}
              opacity={opacity}
              //   filters={[Konva.Filters.RGB]}
              //   red={rgb[0]}
              //   green={rgb[1]}
              //   blue={rgb[2]}
              x={x}
              y={y}
              offsetX={strokeWidth / 2}
              offsetY={strokeWidth / 2}
            />
          );
        });
      });
    }
  }

  return (
    <Layer>
      {drawLines(lines)}
      {liveLine?.points ? drawLines([liveLine]) : <></>}
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

function TestLayerCopy({ lines }) {
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
