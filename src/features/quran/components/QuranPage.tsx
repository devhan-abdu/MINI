import React from "react";
import { View, Image, ActivityIndicator, Text } from "react-native";
import FastImage from "react-native-fast-image";

interface Props {
  pageNumber: number;
  uri?: string;
  pageWidth: number;
  pageHeight: number;
}

export const QuranPage = React.memo(
  ({ pageNumber, uri, pageWidth, pageHeight }: Props) => {
  return (
    <View style={{ width: pageWidth, height: pageHeight }}>
      {uri ?
        <FastImage
          source={{ uri }}
          style={{ width: "100%", height: "100%" }}
          resizeMode={FastImage.resizeMode.contain}
        />
      : null}
    </View>
  );
  }
);