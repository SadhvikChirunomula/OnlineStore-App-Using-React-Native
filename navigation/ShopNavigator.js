import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, SafeAreaView, View } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import { createStackNavigator } from "react-navigation-stack";
import { useDispatch } from "react-redux";
import CustomButton from "../components/UI/CustomButton";
import { colors } from "../constants/colors";
import CartScreen from "../screens/shop/CartScreen";
import OrdersScreen from "../screens/shop/OrdersScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import ProductsOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import StartupScreen from "../screens/StartupScreen";
import AuthScreen from "../screens/user/AuthScreen";
import EditProductsScreen from "../screens/user/EditProductsScreen";
import UserProductsScreen from "../screens/user/UserProductsScreen";
import { logout } from "../store/actions/authActions";

const isAndroid = Platform.OS === "android";

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: isAndroid ? colors.primary : "#fff",
  },
  headerTintColor: isAndroid ? "#fff" : colors.primary,
  headerTitleStyle: {
    fontFamily: "open-sans-bold",
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans", // style of the text next to the BACK button on iOS
  },
};

const ProductNavigator = createStackNavigator(
  {
    ProductsOverview: ProductsOverviewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-list" : "ios-list"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
  }
);

const OrdersNavigator = createStackNavigator(
  {
    Orders: OrdersScreen,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
  }
);

const UserProductsNavigator = createStackNavigator(
  {
    UserProducts: UserProductsScreen,
    EditProduct: EditProductsScreen,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
    navigationOptions: {
      title: "My Products",
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-create" : "ios-create"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
  }
);

const DrawerNavigator = createDrawerNavigator(
  {
    Products: ProductNavigator,
    Orders: OrdersNavigator,
    UserProducts: UserProductsNavigator,
  },
  {
    contentOptions: {
      activeTintColor: colors.primary,
      itemsContainerStyle: {
        marginTop: 48,
      },
    },
    contentComponent: (props) => {
      const dispatch = useDispatch();
      return (
        <View style={{ flex: 1 }}>
          <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
            <DrawerItems {...props} />
            <CustomButton
              title="Logout"
              color={colors.primary}
              onPress={() => {
                dispatch(logout());
                // props.navigation.navigate("Auth");
              }}
              style={{ margin: 16 }}
            />
          </SafeAreaView>
        </View>
      );
    },
  }
);

const AuthNavigator = createStackNavigator(
  {
    Auth: AuthScreen,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  }
);

const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  Auth: AuthNavigator,
  Shop: DrawerNavigator,
});

export default createAppContainer(MainNavigator);
