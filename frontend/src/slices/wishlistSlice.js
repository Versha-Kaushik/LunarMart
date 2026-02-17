import { createSlice } from '@reduxjs/toolkit';

const getInitialWishlist = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      const stored = localStorage.getItem(`wishlist-${user._id}`);
      return stored ? JSON.parse(stored) : [];
    } else {
      const storedGuest = localStorage.getItem('wishlist-guest');
      return storedGuest ? JSON.parse(storedGuest) : [];
    }
  } catch (e) {
    return [];
  }
};

const initialState = {
  wishlistItems: getInitialWishlist()
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const item = action.payload;
      const existItem = state.wishlistItems.find(x => x._id === item._id);
      
      if (!existItem) {
        state.wishlistItems.push(item);

        try {
          const userInfo = localStorage.getItem('userInfo');
          if (userInfo) {
            const user = JSON.parse(userInfo);
            localStorage.setItem(`wishlist-${user._id}`, JSON.stringify(state.wishlistItems));
          } else {
            localStorage.setItem('wishlist-guest', JSON.stringify(state.wishlistItems));
          }
        } catch (e) {
          console.error('Failed to save wishlist to localStorage:', e);
        }
      }
    },
    removeFromWishlist: (state, action) => {
      const itemId = action.payload;
      state.wishlistItems = state.wishlistItems.filter(x => x._id !== itemId);
      
      try {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          const user = JSON.parse(userInfo);
          localStorage.setItem(`wishlist-${user._id}`, JSON.stringify(state.wishlistItems));
        } else {
          localStorage.setItem('wishlist-guest', JSON.stringify(state.wishlistItems));
        }
      } catch (e) {
        console.error('Failed to save wishlist to localStorage:', e);
      }
    },
    toggleWishlist: (state, action) => {
      const item = action.payload;
      const existItem = state.wishlistItems.find(x => x._id === item._id);
      
      if (existItem) {
        state.wishlistItems = state.wishlistItems.filter(x => x._id !== item._id);
      } else {
        state.wishlistItems.push(item);
      }
      
      try {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          const user = JSON.parse(userInfo);
          localStorage.setItem(`wishlist-${user._id}`, JSON.stringify(state.wishlistItems));
        } else {
          localStorage.setItem('wishlist-guest', JSON.stringify(state.wishlistItems));
        }
      } catch (e) {
        console.error('Failed to save wishlist to localStorage:', e);
      }
    },
    clearWishlist: (state) => {
      state.wishlistItems = [];
      
      try {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          const user = JSON.parse(userInfo);
          localStorage.removeItem(`wishlist-${user._id}`);
        } else {
          localStorage.removeItem('wishlist-guest');
        }
      } catch (e) {
        console.error('Failed to clear wishlist from localStorage:', e);
      }
    },
    syncWishlist: (state, action) => {
      state.wishlistItems = action.payload || [];
    }
  }
});

export const { addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist, syncWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
