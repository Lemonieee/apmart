import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  cart: {
    cartItems: [],
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      // add to cart
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: [...state.cart.cartItems, action.payload],
        },
      };
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
