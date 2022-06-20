import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  cart: {
    cartItems: [],
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART':
      // add to cart
      // save the item we wanna add as newItem
      const newItem = action.payload;
      // get exist item based on the criteria used in itempage
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      // if item exist in the cart, use map function to update the current item with new item get from action.payload
      // otherwise keep prev item in the cart
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : // if exist item is null, add it to the end of the array
          [...state.cart.cartItems, newItem];
      return { ...state, cart: { ...state.cart, cartItems } };
    default:
      return state;
  }
}

//wrapper for React app and pass global props to children
export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  //value contains current state in the context and the dispatch to update the state
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
}
