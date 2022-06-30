import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/CustomHeaderButton";
import OrderItem from "../../components/shop/OrderItem";
import { fetchOrders } from "../../store/actions/orderActions";
import LoaderCentered from "../../components/UI/LoaderCentered";
import CenteredText from "../../components/UI/CenteredText";

const OrdersScreen = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchOrders()).then(() => {
      setIsLoading(false);
    });
  }, [dispatch]);

  if (isLoading) {
    return <LoaderCentered />;
  }

  if (orders.length === 0) {
    return (
      <CenteredText>
        You have no orders yet.{"\n"}But you can always add them!
      </CenteredText>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={orders}
      renderItem={(itemData) => (
        <OrderItem
          amount={itemData.item.totalAmount}
          date={itemData.item.readableDate}
          items={itemData.item.items}
        />
      )}
    />
  );
};

OrdersScreen.navigationOptions = (navData) => ({
  headerTitle: "My Orders",
  headerLeft: () => (
    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      <Item
        title="Menu"
        iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
        onPress={() => {
          navData.navigation.toggleDrawer();
        }}
      />
    </HeaderButtons>
  ),
});

const styles = StyleSheet.create({
  list: {
    margin: 16,
  },
});

export default OrdersScreen;
