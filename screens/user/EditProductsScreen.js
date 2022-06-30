import React, { useEffect, useCallback, useReducer, useState } from "react";
import {
  StyleSheet,
  View,
  Platform,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { ScrollView } from "react-navigation";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/CustomHeaderButton";
import { useSelector, useDispatch } from "react-redux";
import {
  createProduct,
  updateProduct,
} from "../../store/actions/productActions";
import ValidatedInput from "../../components/UI/ValidatedInput";
import LoaderCentered from "../../components/UI/LoaderCentered";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  switch (action.type) {
    case FORM_INPUT_UPDATE:
      const updatedValues = {
        ...state.inputValues,
        [action.inputIdentifier]: action.value,
      };
      const updatedValidities = {
        ...state.inputValidities,
        [action.inputIdentifier]: action.isValid,
      };
      let updatedFormIsValid = true;
      for (const key in updatedValidities) {
        updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
      }

      return {
        // ...state,
        inputValues: updatedValues,
        inputValidities: updatedValidities,
        formIsValid: updatedFormIsValid,
      };

    default:
      return state;
  }
};

const EditProductsScreen = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const productId = props.navigation.getParam("productId");
  let editedProduct;
  if (productId) {
    editedProduct = useSelector((state) =>
      state.products.userProducts.find((prod) => prod.id === productId)
    );
  }

  const [formState, formDispatch] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : "",
      imageUrl: editedProduct ? editedProduct.imageUrl : "",
      price: "",
      description: editedProduct ? editedProduct.description : "",
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      price: editedProduct ? true : false,
      description: editedProduct ? true : false,
    },
    formIsValid: editedProduct ? true : false,  
  });

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert(
        "Wrong input values!",
        "All inputs must be fulfilled with correct values.",
        [{ text: "OK" }]
      );
      return;
    }

    setIsLoading(true);
    if (productId) {
      await dispatch(
        updateProduct(
          productId,
          formState.inputValues.title,
          formState.inputValues.description,
          formState.inputValues.imageUrl
        )
      );
    } else {
      await dispatch(
        createProduct(
          formState.inputValues.title,
          formState.inputValues.description,
          formState.inputValues.imageUrl,
          +formState.inputValues.price
        )
      );
    }
    setIsLoading(false);
    props.navigation.goBack();
  }, [dispatch, productId, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      formDispatch({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        inputIdentifier,
      });
    },
    [formDispatch]
  );

  if (isLoading) {
    return <LoaderCentered />;
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <TouchableWithoutFeedback
          onPress={() => Keyboard.dismiss()}
          style={{ flex: 1 }}
        >
          <View
            style={styles.listWrapper}
            behavior="padding"
            KeyboardAvoidingView={100}
          >
            <ValidatedInput
              id="title"
              label="Title"
              value={formState.inputValues.title}
              isValid={!!editedProduct}
              onInputChange={inputChangeHandler}
              errorMessage="Title is required"
              required
            />
            <ValidatedInput
              id="imageUrl"
              label="Image URL"
              value={formState.inputValues.imageUrl}
              isValid={!!editedProduct}
              onInputChange={inputChangeHandler}
              errorMessage="Image URL is required"
              required
            />
            {!editedProduct && (
              <ValidatedInput
                id="price"
                label="Price"
                value={formState.inputValues.price}
                isValid={!!editedProduct}
                onInputChange={inputChangeHandler}
                keyboardType="decimal-pad"
                errorMessage="Price must not be less than $0.1"
                required
                min={0.1}
              />
            )}
            <ValidatedInput
              id="description"
              label="Description"
              value={formState.inputValues.description}
              isValid={!!editedProduct}
              onInputChange={inputChangeHandler}
              errorMessage="Description must be at least 10 characters long"
              multiline
              numberOfLines={3}
              required
              minLength={8}
            />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditProductsScreen.navigationOptions = (navData) => {
  const submit = navData.navigation.getParam("submit");

  return {
    headerTitle: navData.navigation.getParam("productId")
      ? "Edit Product"
      : "Add Product",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
          }
          iconSize={23}
          onPress={submit}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  listWrapper: {
    margin: 16,
    flex: 1,
  },
});

export default EditProductsScreen;
