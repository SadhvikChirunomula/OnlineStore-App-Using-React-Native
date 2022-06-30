import React from "react";
import { Text, View, StyleSheet } from "react-native";

const CenteredText = (props) => {
  return (
    <View style={[styles.centered, props.style]}>
      <Text style={[styles.text, props.textStyle]}>{props.children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "open-sans-bold",
    textAlign: "center",
    margin: 32,
  },
});

export default CenteredText;
