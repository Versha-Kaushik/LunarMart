import React, { useState } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaArrowRight, FaHeart } from 'react-icons/fa';
import Meta from '../components/Meta';
import { toggleWishlist } from '../slices/wishlistSlice';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const navigate = useNavigate();
  const [viewState, setViewState] = useState('initial'); 
  const { searchTerm } = useSelector(state => state.search);
  const { cartItems } = useSelector(state => state.cart);
  const { wishlistItems } = useSelector(state => state.wishlist);
  const dispatch = useDispatch();

  const { data, isLoading, error } = useGetProductsQuery({ keyword: searchTerm, pageSize: 50 });

  const allProducts = data?.products || [];
  console.log('Home Page - Raw Data:', data);
  console.log('Home Page - All Products:', allProducts);

  const validCategories = ['Wall Art', 'Vases', 'Lighting', 'Mirrors', 'Wallpaper', 'Scented Candles'];
  let displayedProducts = allProducts.filter(product => product.category && validCategories.includes(product.category));

  console.log('Home Page - Filtered Products:', displayedProducts);
  if (allProducts.length > 0 && displayedProducts.length === 0) {
    console.log('Home Page - No matches found, falling back to all products');
    displayedProducts = allProducts;
  }

  const totalProducts = displayedProducts.length;
  const halfLimit = Math.ceil(totalProducts * 0.5);
  const seventyPercentLimit = Math.ceil(totalProducts * 0.7);

  const visibleCount = viewState === 'initial' ? halfLimit : seventyPercentLimit;
  const productsToRender = displayedProducts.slice(0, visibleCount);

  const handleToggleWishlist = (item) => {
    dispatch(toggleWishlist({ _id: item._id, name: item.name, image: item.image, price: item.price }));
  };

  if (isLoading) return <div className="mt-5"><Loader /></div>;
  if (error) return <div className="mt-5"><Message variant='danger'>{error?.data?.message || error?.error || 'Error loading products'}</Message></div>;

  return (
    <>
      <Meta title='LunarMart' />

      <div className="text-center py-5">
        <h1 style={{ color: '#e2e8f0' }}>Welcome to LunarMart</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Discover the best products for your home and lifestyle.</p>
      </div>

      <Row className='g-4 mb-5'>
        {productsToRender.length > 0 ? (
          productsToRender.map(item => (
            <Col key={item._id} sm={12} md={6} lg={3}>
              <ProductCard item={item} handleToggleWishlist={handleToggleWishlist} wishlistItems={wishlistItems} navigate={navigate} dispatch={dispatch} cartItems={cartItems} />
            </Col>
          ))
        ) : (
          <Col xs={12}><p className="text-center" style={{ fontSize: '1.2rem', color: '#e2e8f0' }}>No products found in active categories.</p></Col>
        )}
      </Row>

      <div className="text-center mb-5">
        {viewState === 'initial' && totalProducts > halfLimit && (
          <Button
            variant='outline-info'
            className='px-4 py-2'
            style={{ fontSize: '1.1rem', borderRadius: '30px', borderWidth: '2px' }}
            onClick={() => setViewState('expanded')}
          >
            View More Products <FaArrowRight className='ms-2' />
          </Button>
        )}

        {viewState === 'expanded' && (
        <Button
          variant='primary'
          className='px-4 py-2'
          style={{ fontSize: '1.1rem', borderRadius: '30px', background: '#38bdf8', border: 'none' }}
          onClick={() => navigate('/categories')}
        >
          Browse All Categories <FaArrowRight className='ms-2' />
        </Button>
        )}
      </div>
    </>
  );
};

export default HomePage;
