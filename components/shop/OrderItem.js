import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { colors } from "../../constants/colors";
import CartItem from "./CartItem";
import CustomButton from "../UI/CustomButton";
import Card from "../UI/Card";

const OrderItem = (props) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card style={styles.orderItem}>
      <View style={styles.summaryBlock}>
        <Text style={styles.date}>{props.date}</Text>
        <Text style={styles.totalAmount}>${props.amount.toFixed(2)}</Text>
      </View>
      <CustomButton
        color={colors.secondary}
        title={showDetails ? "Hide Details" : "Show Details"}
        onPress={() => setShowDetails((prev) => !prev)}
      />
      {showDetails && (
        <View style={styles.cartItemsContainer}>
          {props.items.map((item) => (
            <CartItem
              key={item.id}
              title={item.productTitle}
              amount={item.sum}
              quantity={item.quantity}
            />
          ))}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  orderItem: {
    alignItems: "center",
    marginBottom: 16,
    marginHorizontal: 4,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  summaryBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
  totalAmount: {
    fontFamily: "open-sans-bold",
  },
  date: {
    fontFamily: "open-sans",
  },
  cartItemsContainer: {
    width: "100%",
    margin: 8,
  },
});

export default OrderItem;
