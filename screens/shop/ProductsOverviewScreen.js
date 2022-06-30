import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";
import ProductItem from "../../components/shop/ProductItem";
import CustomButton from "../../components/UI/CustomButton";
import CustomHeaderButton from "../../components/UI/CustomHeaderButton";
import LoaderCentered from "../../components/UI/LoaderCentered";
import { colors } from "../../constants/colors";
import { addToCart } from "../../store/actions/cartActions";
import { fetchProducts } from "../../store/actions/productActions";

const ProductsOverviewScreen = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const products = useSelector((state) => state.products.availableProducts);

  const loadProducts = useCallback(async () => {
    setIsRefreshing(true);
    await dispatch(fetchProducts());
    setIsRefreshing(false);
  }, [setIsRefreshing, dispatch]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, setIsLoading]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      "willFocus",
      loadProducts
    );

    return () => {
      willFocusSub.remove();
    };
  }, [loadProducts]);

  const viewDetails = (id, title) => {
    props.navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title,
    });
  };

  if (isLoading) {
    return <LoaderCentered />;
  }

  return (
    <FlatList
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={products}
      renderItem={(itemData) => (
        <ProductItem
          imageUrl={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onPress={() => viewDetails(itemData.item.id, itemData.item.title)}
        >
          <CustomButton
            title="View Details"
            onPress={() => viewDetails(itemData.item.id, itemData.item.title)}
            color={colors.primary}
            style={styles.btn}
          />
          <CustomButton
            title="Add to Cart"
            onPress={() => dispatch(addToCart(itemData.item))}
            color={colors.secondary}
            style={styles.btn}
          />
        </ProductItem>
      )}
    />
  );
};

ProductsOverviewScreen.navigationOptions = (navData) => ({
  headerTitle: "All products",
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
  headerRight: () => (
    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      <Item
        title="Cart"
        iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
        onPress={() => {
          navData.navigation.navigate("Cart");
        }}
      />
    </HeaderButtons>
  ),
});

const styles = StyleSheet.create({
  btn: {
    width: "35%",
  },
});

export default ProductsOverviewScreen;
