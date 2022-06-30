import React from "react";
import { StyleSheet, View, Text } from "react-native";

const Card = (props) => {
  return <View style={[styles.card, props.style]}>{props.children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
    backgroundColor: "#fff",
  },
});

export default Card;
