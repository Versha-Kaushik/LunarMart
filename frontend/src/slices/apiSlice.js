import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      if (user?.token) {
        headers.set('authorization', `Bearer ${user.token}`);
      }
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    console.log('API Error:', result.error);
    if (result.error.status === 401 || result.error.status === '401') {
      console.log('Detected 401 - Forcing logout and redirect');
      api.dispatch({ type: 'auth/logout' });
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({}),
});
