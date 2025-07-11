import styled from "styled-components";
import { getInspirationMetaData } from "../api";
import Tile from "./Tile";
import { useEffect, useState } from "react";

export default function InspirationTile({ date }) {
  const [inspiration, setInspiration] = useState({});

  useEffect(() => {
    let {
      inspiration: { thumbnailUrl, label, artist_title },
    } = getInspirationMetaData(date);
    setInspiration(inspiration);
  }, []);

  const testMetaData = {
    thumbnailUrl:
      "https://www.artic.edu/iiif/2/25c31d8d-21a4-9ea1-1d73-6a2eca4dda7e/full/400,/0/default.jpg",
    label: "The Bedroom",
    artist_title: "Vincent Van Gogh",
  };
  let {
    inspiration: { thumbnailUrl, label, artist_title },
  } = testMetaData;

  return (
    <Tile src={thumbnailUrl}>
      {label}
      {artist_title}
    </Tile>
  );
}
