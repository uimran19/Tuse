import styled from "styled-components";
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

  // const testMetaData = {
  //   inspiration: {
  //     thumbnailUrl:
  //       "https://www.artic.edu/iiif/2/25c31d8d-21a4-9ea1-1d73-6a2eca4dda7e/full/400,/0/default.jpg",
  //     title: "The Bedroom",
  //     artist: "Vincent Van Gogh",
  //     medium: "oil on canvas",
  //   },
  // };
  let {
    title = null,
    artist = null,
    medium = null,
    thumbnailUrl = null,
    imageUrl = null,
  } = inspiration;

  return (
    <Tile src={thumbnailUrl} label={label}>
      {title}
      {artist}
      {medium}
    </Tile>
  );
}
