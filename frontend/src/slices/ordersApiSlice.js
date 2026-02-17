import { ORDERS_URL, RAZORPAY_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createOrder: builder.mutation({
      query: order => ({
        url: ORDERS_URL,
        method: 'POST',
        body: { ...order }
      }),
      invalidatesTags: ['Order']
    }),
    getOrderDetails: builder.query({
      query: orderId => ({
        url: `${ORDERS_URL}/${orderId}`
      }),
      providesTags: ['Order']
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/my-orders`
      }),
      providesTags: ['Order']
    }),
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: 'PUT',
        body: { ...details }
      }),
      invalidatesTags: ['Order']
    }),
    updateDeliver: builder.mutation({
      query: orderId => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: 'PUT'
      }),
      invalidatesTags: ['Order']
    }),
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL
      }),
      providesTags: ['Order']
    }),
    getSellerOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/seller-orders`
      }),
      providesTags: ['Order']
    }),
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `${ORDERS_URL}/${orderId}/item-status`,
        method: 'PUT',
        body: { status }
      }),
      invalidatesTags: ['Order']
    }),
    cancelOrder: builder.mutation({
      query: ({ orderId, cancelReason }) => ({
        url: `${ORDERS_URL}/${orderId}/cancel`,
        method: 'PUT',
        body: { cancelReason }
      }),
      invalidatesTags: ['Order']
    }),
    returnOrder: builder.mutation({
      query: ({ orderId, returnReason, returnImage, returnVideo }) => ({
        url: `${ORDERS_URL}/${orderId}/return`,
        method: 'PUT',
        body: { returnReason, returnImage, returnVideo }
      }),
      invalidatesTags: ['Order']
    })
  })
});

export const {
  useGetOrderDetailsQuery,
  useCreateOrderMutation,
  usePayOrderMutation,
  useUpdateDeliverMutation,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useGetSellerOrdersQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useReturnOrderMutation
} = ordersApiSlice;
