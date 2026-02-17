import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import ProductPage from '../pages/ProductPage';
import HomePage from '../pages/HomePage';
import CartPage from '../pages/CartPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ShippingPage from '../pages/ShippingPage';
import PrivateRoute from '../components/PrivateRoute';
import PaymentPage from '../pages/PaymentPage';
import PlaceOrderPage from '../pages/PlaceOrderPage';
import OrderDetailsPage from '../pages/OrderDetailsPage';
import ProfilePage from '../pages/ProfilePage';
import CategoriesPage from '../pages/CategoriesPage';
import CategoryDetailPage from '../pages/CategoryDetailPage';
import BecomeSellerPage from '../pages/BecomeSellerPage';
import BecomeSellerFormPage from '../pages/BecomeSellerFormPage';
import MyWishlistPage from '../pages/MyWishlistPage';
import UpdateProfilePage from '../pages/UpdateProfilePage';
import SellerApplicationSuccessPage from '../pages/SellerApplicationSuccessPage';
import PreviousOrdersPage from '../pages/PreviousOrdersPage';
import ViewProfilePage from '../pages/ViewProfilePage';
import StaticProductPage from '../pages/StaticProductPage';
import ReturnOrderPage from '../pages/ReturnOrderPage';
import SellerRoute from '../components/SellerRoute';
import SellerLayout from '../components/SellerLayout';
import SellerHomePage from '../pages/seller/SellerHomePage';
import SellerOrdersPage from '../pages/seller/SellerOrdersPage';
import SellerAddProductPage from '../pages/seller/SellerAddProductPage';
import SellerProductsPage from '../pages/seller/SellerProductsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        path: '/',
        element: <HomePage />
      },
      {
        path: '/categories',
        element: <CategoriesPage />
      },
      {
        path: '/categories/:categoryId',
        element: <CategoryDetailPage />
      },
      {
        path: '/become-seller',
        element: <BecomeSellerPage />
      },
      {
        path: '/become-seller/apply',
        element: <BecomeSellerFormPage />
      },
      {
        path: '/become-seller/success',
        element: <SellerApplicationSuccessPage />
      },
      {
        path: '/product/:id',
        element: <ProductPage />
      },
      {
        path: '/static-product/:id',
        element: <StaticProductPage />
      },
      {
        path: '/cart',
        element: <CartPage />
      },
      {
        path: '/login',
        element: <LoginPage />
      },
      {
        path: '/register',
        element: <RegisterPage />
      },
      {
        path: '',
        element: <PrivateRoute />,
        children: [
          {
            path: '/shipping',
            element: <ShippingPage />
          },
          {
            path: '/payment',
            element: <PaymentPage />
          },
          {
            path: '/place-order',
            element: <PlaceOrderPage />
          },
          {
            path: '/order/:id',
            element: <OrderDetailsPage />
          },
          {
            path: '/profile',
            element: <ProfilePage />
          },
          {
            path: '/profile/view',
            element: <ViewProfilePage />
          },
          {
            path: '/profile/edit',
            element: <UpdateProfilePage />
          },
          {
            path: '/wishlist',
            element: <MyWishlistPage />
          },
          {
            path: '/orders',
            element: <PreviousOrdersPage />
          },
          {
            path: '/order/:id/return',
            element: <ReturnOrderPage />
          }
        ]
      },
      {
        path: '/seller',
        element: <SellerRoute />,
        children: [
          {
            element: <SellerLayout />,
            children: [
              {
                path: 'home',
                element: <SellerHomePage />
              },
              {
                path: 'orders',
                element: <SellerOrdersPage />
              },
              {
                path: 'add-product',
                element: <SellerAddProductPage />
              },
              {
                path: 'products',
                element: <SellerProductsPage />
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: '',
        children: [
          {
            path: '/admin/order/:id',
            element: <OrderDetailsPage />
          }
        ]
      }
    ]
  }
]);
const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
