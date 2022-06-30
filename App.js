import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import React, { useState } from "react";
import { Provider } from "react-redux";
import { combineReducers, createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import cartReducer from "./store/reducers/cartReducer";
import ordersReducer from "./store/reducers/ordersReducer";
import productReducer from "./store/reducers/productReducer";
import ReduxThunk from "redux-thunk";
import authReducer from "./store/reducers/authReducer";
import NavigatorContainer from "./navigation/NavigatorContainer";

const rootReducer = combineReducers({
  products: productReducer,
  cart: cartReducer,
  orders: ordersReducer,
  auth: authReducer,
});

const store = createStore(
  rootReducer,
  applyMiddleware(ReduxThunk),
  composeWithDevTools()
);

const fetchFonts = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  });
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  if (!fontsLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontsLoaded(true);
        }}
        onError={(error) => console.error(error)}
      />
    );
  }

  return (
    <Provider store={store}>
    
      <NavigatorContainer />
    </Provider>
  );
}
