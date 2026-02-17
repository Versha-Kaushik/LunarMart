export const addDecimals = num => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = state => {
  const selectedItems = state.cartItems.filter(item => item.selected !== false);

  state.itemsPrice = addDecimals(
    selectedItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  state.shippingPrice = addDecimals(Number(state.itemsPrice) >= 1000 || selectedItems.length === 0 ? 0 : 50);
  state.taxPrice = addDecimals(Number((18 / 100) * Number(state.itemsPrice)));
  state.totalPrice = addDecimals(
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  );

  try {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      localStorage.setItem(`cart-${user._id}`, JSON.stringify(state));
    } else {
      localStorage.setItem('cart-guest', JSON.stringify(state));
    }
  } catch (e) {
    console.error('Failed to save cart to localStorage:', e);
  }

  return state;
};
