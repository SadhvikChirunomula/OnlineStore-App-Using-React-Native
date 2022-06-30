import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "../../constants/colors";

const LoaderCentered = () => {
  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoaderCentered;
