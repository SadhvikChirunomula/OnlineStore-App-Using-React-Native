import { Alert } from "react-native";
import Order from "../../models/order";

export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = "SET_ORDERS";

export const fetchOrders = () => async (dispatch, getState) => {
  const userId = getState().auth.userId;

  try {
    const response = await fetch(
      `https://shop-reactnative-13438-default-rtdb.firebaseio.com/orders/${userId}.json`
    );

    if (!response.ok) {
      throw new Error(
        "Unexpected error occurred while loading data from the server"
      );
    }

    const responseData = await response.json();

    const fetchedOrdersArray = [];
    for (const key in responseData) {
      fetchedOrdersArray.push(
        new Order(
          key,
          responseData[key].cartItems,
          responseData[key].totalAmount,
          new Date(responseData[key].date)
        )
      );
    }

    dispatch({ type: SET_ORDERS, orders: fetchedOrdersArray.reverse() });
  } catch (error) {
    Alert.alert("Error occurred!", error.message, [{ text: "OK" }]);
  }
};

export const addOrder =
  (cartItems, totalAmount) => async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;

    try {
      const date = new Date();

      const response = await fetch(
        `https://shop-reactnative-13438-default-rtdb.firebaseio.com/orders/${userId}.json?auth=${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartItems,
            totalAmount,
            date: date.toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unexpected error occurred while loading data from the server"
        );
      }

      const responseData = await response.json();

      dispatch({
        type: ADD_ORDER,
        orderData: {
          id: responseData.name,
          items: cartItems,
          amount: totalAmount,
          date,
        },
      });
    } catch (error) {
      Alert.alert("Error occurred!", error.message, [{ text: "OK" }]);
    }
  };
