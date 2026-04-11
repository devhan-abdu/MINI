import React from "react";
import { View,  ActivityIndicator, Text } from "react-native";
import { Image } from "expo-image";

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
        <Image
          source={{ uri }}
          style={{ width: "100%", height: "100%" }}
          contentFit="contain"
        />
      : null}
    </View>
  );
  }
);