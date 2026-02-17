import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHeart } from 'react-icons/fa';
import { addToCart } from '../slices/cartSlice';
import { toggleWishlist } from '../slices/wishlistSlice';
import Meta from '../components/Meta';

const MyWishlistPage = () => {
  const { userInfo } = useSelector(state => state.auth);
  const { cartItems } = useSelector(state => state.cart);
  const { wishlistItems } = useSelector(state => state.wishlist);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleToggleWishlist = (item) => {
    dispatch(toggleWishlist(item));
  };

  return (
    <>
      <Meta title='LunarMart' />
      <div style={{ marginTop: '40px', position: 'relative', textAlign: 'center' }}>
        <Button
          variant='link'
          style={{
            position: 'absolute',
            left: '0',
            top: '0',
            color: '#34d399',
            border: 'none',
            padding: '8px 12px',
            fontSize: '1.3rem',
            transition: 'all 0.3s',
            zIndex: 10,
            textDecoration: 'none'
          }}
          onClick={() => navigate('/profile')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(-5px)';
            e.currentTarget.style.color = '#10b981';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.color = '#34d399';
          }}
          title='Back to Profile'
        >
          <FaArrowLeft />
        </Button>
      </div>
      <Container className='py-4'>
        {wishlistItems.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 40px',
            borderRadius: '15px',
            border: '2px solid rgba(52, 211, 153, 0.3)',
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            maxWidth: '640px',
            margin: '40px auto'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px', color: '#34d399' }}>❤️</div>

            <p style={{ fontSize: '1.3rem', marginBottom: '30px', color: '#e2e8f0', fontWeight: '600' }}>Your wishlist is empty</p>
            <p style={{ fontSize: '1rem', marginBottom: '30px', color: '#94a3b8' }}>Start exploring our amazing collection of decorations and click the heart icon to add items</p>
            <Button
              onClick={() => navigate('/')}
              style={{
                background: 'linear-gradient(135deg, #34d399, #22d3ee)',
                border: 'none',
                fontWeight: '700',
                padding: '12px 40px',
                fontSize: '1rem',
                borderRadius: '8px'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Start Exploring
            </Button>
          </div>
        ) : (
          <Row className='g-4' style={{ marginTop: '24px' }}>
            {wishlistItems.map(item => (
              <Col key={item._id} sm={12} md={6} lg={4}>
                <Card
                  className='h-100 shadow-lg position-relative'
                  style={{ transition: 'transform 0.3s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-8px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <Button
                    variant='light'
                    size='sm'
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      borderRadius: '50%',
                      padding: '8px',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      border: 'none',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleWishlist(item);
                    }}
                    disabled={false}
                    title={'Remove from wishlist'}
                  >
                    <FaHeart color={'#e11d48'} />
                  </Button>
                  <Card.Img
                    variant='top'
                    src={item.image}
                    style={{ height: '220px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    {item.desc && (
                      <Card.Text className='small' style={{ color: '#e2e8f0' }}>{item.desc}</Card.Text>
                    )}
                    <div className='d-flex justify-content-between align-items-center'>
                      <Card.Subtitle className='text-info fw-bold'>₹{item.price}</Card.Subtitle>
                      {item.rating && (
                        <span className='text-warning'>
                          ⭐ {item.rating} ({Array.isArray(item.reviews) ? item.reviews.length : item.numReviews || 0})
                        </span>
                      )}
                    </div>
                  </Card.Body>
                  <div className='d-flex gap-2 p-3 pt-0'>
                    <Button
                      variant='success'
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(toggleWishlist(item));
                      }}
                      style={{ fontWeight: '700', flex: 1 }}
                    >
                      Remove
                    </Button>
                    <Button
                      variant='success'
                      onClick={(e) => {
                        e.stopPropagation();
                        const isInCart = cartItems.some(cartItem => cartItem._id === item.id);
                        if (isInCart) {
                          navigate('/cart');
                        } else {
                          dispatch(addToCart({ ...item, _id: item.id, qty: 1, countInStock: 20 }));
                        }
                      }}
                      style={{ fontWeight: '700', flex: 1 }}
                    >
                      {cartItems.some(cartItem => cartItem._id === item.id) ? 'View in Cart' : 'Add to Cart'}
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
};

export default MyWishlistPage;
