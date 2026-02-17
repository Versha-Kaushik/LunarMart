import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils';

const getInitialCart = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    let cart;
    if (userInfo) {
      const user = JSON.parse(userInfo);
      const stored = localStorage.getItem(`cart-${user._id}`);
      cart = stored ? JSON.parse(stored) : { cartItems: [], shippingAddress: {}, paymentMethod: 'Cash on Delivery' };
    } else {
      const storedGuest = localStorage.getItem('cart-guest');
      cart = storedGuest ? JSON.parse(storedGuest) : { cartItems: [], shippingAddress: {}, paymentMethod: 'Cash on Delivery' };
    }

    if (cart.cartItems) {
      cart.cartItems = cart.cartItems.map(item => ({
        ...item,
        selected: item.selected !== undefined ? item.selected : true
      }));
    }
    return cart;
  } catch (e) {
    return { cartItems: [], shippingAddress: {}, paymentMethod: 'Cash on Delivery' };
  }
};

const initialState = getInitialCart();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find(x => x._id === item._id);

      const newItem = {
        ...item,
        selected: item.selected !== undefined ? item.selected : true
      };

      if (existItem) {
        state.cartItems = state.cartItems.map(x =>
          x._id === existItem._id ? newItem : x
        );
      } else {
        state.cartItems = [...state.cartItems, newItem];
      }

      return updateCart(state);
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter(x => x._id !== id);

      return updateCart(state);
    },
    toggleSelectItem: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.map(item =>
        item._id === id ? { ...item, selected: !item.selected } : item
      );
      return updateCart(state);
    },
    selectOnlyItem: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.map(item => ({
        ...item,
        selected: item._id === id
      }));
      return updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },
    clearCartItems: (state, action) => {
      state.cartItems = state.cartItems.filter(item => !item.selected);
      return updateCart(state);
    },
    syncCart: (state, action) => {
      const newState = action.payload || { cartItems: [], shippingAddress: {}, paymentMethod: 'Cash on Delivery' };
      state.cartItems = (newState.cartItems || []).map(item => ({
        ...item,
        selected: item.selected !== undefined ? item.selected : true
      }));
      state.shippingAddress = newState.shippingAddress || {};
      state.paymentMethod = newState.paymentMethod || 'Cash on Delivery';
      state.itemsPrice = newState.itemsPrice;
      state.shippingPrice = newState.shippingPrice;
      state.taxPrice = newState.taxPrice;
      state.totalPrice = newState.totalPrice;
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  toggleSelectItem,
  selectOnlyItem,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  syncCart
} = cartSlice.actions;

export default cartSlice.reducer;
