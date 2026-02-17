import { PRODUCTS_URL, UPLOAD_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProducts: builder.query({
      query: ({ limit, skip, keyword, category, pageNumber, pageSize, userId }) => ({
        url: PRODUCTS_URL,
        params: {
          pageSize: limit || pageSize,
          skip,
          keyword,
          category,
          pageNumber: pageNumber || 1,
          userId
        }
      }),
      providesTags: ['Product']
    }),
    getTopProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/top`
      }),
      providesTags: ['Product']
    }),
    getProductDetails: builder.query({
      query: productId => ({
        url: `${PRODUCTS_URL}/${productId}`
      }),
      providesTags: ['Product']
    }),
    createProduct: builder.mutation({
      query: productData => ({
        url: PRODUCTS_URL,
        method: 'POST',
        body: productData
      }),
      invalidatesTags: ['Product']
    }),
    updateProduct: builder.mutation({
      query: ({ productId, ...productData }) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'PUT',
        body: { ...productData }
      }),
      invalidatesTags: ['Product']
    }),
    deleteProduct: builder.mutation({
      query: productId => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Product']
    }),
    uploadProductImage: builder.mutation({
      query: data => ({
        url: UPLOAD_URL,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Product']
    }),
    createProductReview: builder.mutation({
      query: ({ productId, ...reviewData }) => ({
        url: `${PRODUCTS_URL}/${productId}/reviews`,
        method: 'POST',
        body: { ...reviewData }
      }),
      invalidatesTags: ['Product']
    }),
    deleteProductReview: builder.mutation({
      query: ({ productId, reviewId }) => ({
        url: `${PRODUCTS_URL}/${productId}/reviews/${reviewId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Product']
    })
  })
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
  useUpdateProductMutation,
  useCreateProductReviewMutation,
  useDeleteProductReviewMutation,
  useGetTopProductsQuery
} = productApiSlice;
