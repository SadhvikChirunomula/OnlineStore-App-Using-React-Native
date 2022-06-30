import React from "react";
import {
  StyleSheet,
  Text,
  Platform,
  View,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";

const CartItem = (props) => {
  return (
    <View style={styles.cartItem}>
      <View style={styles.itemData}>
        <Text style={styles.quantity}>{props.quantity}</Text>
        <Text style={styles.mainText}> {props.title}</Text>
      </View>
      <View style={styles.itemData}>
        <Text style={styles.mainText}>${props.amount.toFixed(2)}</Text>
        {props.deletable && (
          <TouchableOpacity
            onPress={props.onRemove}
            style={styles.deleteButton}
          >
            <Ionicons
              name={
                Platform.OS === "android"
                  ? "md-trash-outline"
                  : "ios-trash-outline"
              }
              size={23}
              color="red"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.primary,
    marginVertical: 4,
    marginHorizontal: 16,
    padding: 8,
  },
  itemData: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantity: {
    fontFamily: "open-sans",
    color: "#888",
    borderWidth: 1,
    borderColor: "#888",
    paddingVertical: 1,
    paddingRight: 4,
    paddingLeft: 6,
    borderRadius: 6,
  },
  mainText: {
    fontFamily: "open-sans-bold",
  },
  deleteButton: {
    marginLeft: 8,
  },
});

export default CartItem;
