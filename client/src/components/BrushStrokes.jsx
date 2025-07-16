import { BsConeStriped } from "react-icons/bs";
import { Image, Layer, Stage } from "react-konva";
import useImage from "use-image";

export default function BrushStrokes({ lines, liveLine }) {
  const brushLookup = {
    brush: "Ink-01.png",
  };
  const brushUrl = (currentBrush) => `/src/assets/brushes/${currentBrush}`;
  const [brushTexture] = useImage(brushUrl(brushLookup.brush));
  //   const brushUrl = "https://konvajs.github.io/assets/yoda.jpg";

  function drawLines(lines) {
    const brushStrokes = lines.filter((line) => {
      const { tool } = line;
      return brushLookup?.[tool];
    });
    if (brushStrokes?.[0]?.points) {
      return brushStrokes.map((line, i) => {
        const { strokeWidth, opacity, colour, tool } = line;
        // const [brushTexture] = useImage(brushUrl(brushLookup?.[tool]));
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
              image={brushTexture}
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
    <>
      {drawLines(lines)}
      {liveLine?.points ? drawLines([liveLine]) : <></>}
    </>
  );
}
