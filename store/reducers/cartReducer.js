import CartItem from "../../models/cartItem";
import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cartActions";
import { ADD_ORDER } from "../actions/orderActions";
import { DELETE_PRODUCT } from "../actions/productActions";

const initialState = {
  items: {},
  totalAmount: 0,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const productToAdd = action.product;
      const productPrice = productToAdd.price;
      const productTitle = productToAdd.title;

      let updatedOrNewCartItem;

      if (state.items[productToAdd.id]) {
        updatedOrNewCartItem = new CartItem(
          state.items[productToAdd.id].quantity + 1,
          productPrice,
          productTitle,
          state.items[productToAdd.id].sum + productPrice
        );
      } else {
        updatedOrNewCartItem = new CartItem(
          1,
          productPrice,
          productTitle,
          productPrice
        );
      }
      return {
        // ...state,
        items: { ...state.items, [productToAdd.id]: updatedOrNewCartItem },
        totalAmount: state.totalAmount + productPrice,
      };

    case REMOVE_FROM_CART:
      const selectedCartItem = state.items[action.id];
      let updatedCartItems;

      if (selectedCartItem.quantity > 1) {
        const updatedCartItem = new CartItem(
          selectedCartItem.quantity - 1,
          selectedCartItem.productPrice,
          selectedCartItem.productTitle,
          selectedCartItem.sum - selectedCartItem.productPrice
        );
        updatedCartItems = { ...state.items, [action.id]: updatedCartItem };
      } else {
        updatedCartItems = { ...state.items };
        delete updatedCartItems[action.id];
      }
      return {
        //   ...state,
        items: updatedCartItems,
        totalAmount: state.totalAmount - selectedCartItem.productPrice,
      };

    case ADD_ORDER:
      return initialState;

    case DELETE_PRODUCT:
      if (!state.items[action.id]) {
        return state;
      }

      const updatedItems = { ...state.items };
      const itemTotal = state.items[action.id].sum;

      delete updatedItems[action.id];

      return {
        ...state,
        items: updatedItems,
        totalAmount: state.totalAmount - itemTotal,
      };

    default:
      return state;
  }
};

export default cartReducer;
