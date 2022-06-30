import React from "react";
import { Button, View, StyleSheet } from "react-native";

const CustomButton = (props) => {
  return (
    <View style={[styles.btnContainer, props.style]}>
      <Button
        title={props.title}
        onPress={props.onPress}
        color={props.color}
        disabled={props.disabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    borderRadius: 8,
    overflow: "hidden",
  },
});

export default CustomButton;
