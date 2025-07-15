import { getInspirationMetaData } from "../api";
import Tile from "./Tile";
import { useEffect, useState } from "react";

export default function InspirationTile({ date, label }) {
  const [inspiration, setInspiration] = useState({});

  useEffect(() => {
    getInspirationMetaData(date).then(({ inspiration }) => {
      setInspiration(inspiration);
    });
  }, []);

  let {
    title = null,
    artist = null,
    medium = null,
    thumbnailUrl = null,
    imageUrl = null,
  } = inspiration;

  return (
    <Tile
      src={thumbnailUrl}
      label={label}
      alt={`${title}\n${artist}\n${medium}`}
    />
  );
}
