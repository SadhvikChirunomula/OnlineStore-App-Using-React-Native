import Product from "../../models/product";
import {
  CREATE_PRODUCT,
  DELETE_PRODUCT,
  SET_PRODUCTS,
  UPDATE_PRODUCT,
} from "../actions/productActions";

const initialState = {
  availableProducts: [],
  userProducts: [],
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        ...state,
        availableProducts: action.products,
        userProducts: action.userProducts,
      };

    case DELETE_PRODUCT:
      return {
        ...state,
        availableProducts: state.availableProducts.filter(
          (prod) => prod.id !== action.id
        ),
        userProducts: state.userProducts.filter(
          (prod) => prod.id !== action.id
        ),
      };

    case CREATE_PRODUCT:
      const newProduct = new Product(
        action.productData.id,
        action.productData.ownerId,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        action.productData.price
      );

      return {
        ...state,
        availableProducts: [...state.availableProducts, newProduct],
        userProducts: [...state.userProducts, newProduct],
      };

    case UPDATE_PRODUCT:
      const productToUpdateIndex = state.userProducts.findIndex(
        (prod) => prod.id === action.id
      );
      const updatedProduct = new Product(
        action.id,
        state.userProducts[productToUpdateIndex].ownerId,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        state.userProducts[productToUpdateIndex].price
      );

      const updatedUserProducts = [...state.userProducts];
      updatedUserProducts[productToUpdateIndex] = updatedProduct;

      const availableProductIndex = state.availableProducts.findIndex(
        (prod) => prod.id === action.id
      );
      const updatedAvailableProducts = [...state.availableProducts];
      updatedAvailableProducts[availableProductIndex] = updatedProduct;

      return {
        ...state,
        userProducts: updatedUserProducts,
        availableProducts: updatedAvailableProducts,
      };

    default:
      return state;
  }
};

export default productReducer;
