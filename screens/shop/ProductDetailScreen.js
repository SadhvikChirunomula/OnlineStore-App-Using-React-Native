import React from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import { useSelector } from "react-redux";
import { colors } from "../../constants/colors";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/actions/cartActions";
import CustomButton from "../../components/UI/CustomButton";

const ProductDetailScreen = (props) => {
  const dispatch = useDispatch();
  const productId = props.navigation.getParam("productId");
  const selectedProduct = useSelector((state) =>
    state.products.availableProducts.find((prod) => prod.id === productId)
  );

  return (
    <ScrollView>
      <Image source={{ uri: selectedProduct.imageUrl }} style={styles.image} />
      <View style={styles.btnContainer}>
        <CustomButton
          title="Add to Cart"
          color={colors.primary}
          onPress={() => {
            dispatch(addToCart(selectedProduct));
          }}
        />
      </View>
      <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>
    </ScrollView>
  );
};

ProductDetailScreen.navigationOptions = (navData) => {
  return {
    headerTitle: navData.navigation.getParam("productTitle"),
  };
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300,
  },
  btnContainer: {
    marginVertical: 8,
    alignItems: "center",
  },
  price: {
    fontSize: 20,
    color: "#888",
    textAlign: "center",
    marginVertical: 16,
    fontFamily: "open-sans-bold",
  },
  description: {
    textAlign: "center",
    marginHorizontal: 16,
    fontFamily: "open-sans",
  },
});

export default ProductDetailScreen;
