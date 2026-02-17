import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Button, ListGroup, Card, Image } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { FaIndianRupeeSign, FaArrowLeft } from 'react-icons/fa6';
import Meta from '../components/Meta';
import { addCurrency } from '../utils/addCurrency';

const PlaceOrderPage = () => {
  const {
    cartItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = useSelector(state => state.cart);
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!shippingAddress) {
      navigate('/shipping');
    }
    if (!paymentMethod) {
      navigate('/payment');
    }
  }, [shippingAddress, paymentMethod, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cartItems.filter(item => item.selected !== false),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };
  return (
    <>
      <Meta title={'Place Order'} />
      <div style={{ position: 'relative', textAlign: 'center', marginBottom: '30px', marginTop: '40px' }}>
        <Button
          variant='link'
          className='text-success p-0'
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute',
            left: '0',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '1.5rem',
            textDecoration: 'none',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-50%) translateX(-5px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(-50%) translateX(0)')}
        >
          <FaArrowLeft />
        </Button>
        <h1 className='fw-bold m-0' style={{ color: '#fff' }}>Preview Order</h1>
      </div>
      <Row className='g-4'>
        <Col md={8}>
          <ListGroup variant='flush' style={{ borderRadius: '15px', overflow: 'hidden', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
            <ListGroup.Item
              style={{ background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(10px)' }}
              className='text-light border-secondary p-4'
            >
              <h2 className='text-success fw-bold'><i className='fas fa-shipping-fast me-2'></i>Shipping</h2>
              <p className='mb-2'>
                <strong style={{ color: '#34d399' }}>Customer Name:</strong> {shippingAddress.name}
              </p>
              <p className='mb-0'>
                <strong style={{ color: '#34d399' }}>Address:</strong> {shippingAddress.address},{' '}
                {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                {shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item
              style={{ background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(10px)' }}
              className='text-light border-secondary p-4'
            >
              <h2 className='text-success fw-bold'><i className='fas fa-credit-card me-2'></i>Payment Method</h2>
              <p className='mb-0'>
                <strong style={{ color: '#34d399' }}>Method:</strong> {paymentMethod}
              </p>
            </ListGroup.Item>
            <ListGroup.Item
              style={{ background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(10px)' }}
              className='text-light border-secondary p-4'
            >
              <h2 className='text-success fw-bold'><i className='fas fa-shopping-basket me-2'></i>Order Items</h2>
              {cartItems.filter(item => item.selected !== false).length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cartItems.filter(item => item.selected !== false).map(item => (
                    <ListGroup.Item key={item._id} className='bg-transparent text-light border-secondary px-0'>
                      <Row className='align-items-center'>
                        <Col md={2}>
                          <Image src={item.image} alt={item.name} fluid rounded style={{ border: '1px solid rgba(148, 163, 184, 0.2)' }} />
                        </Col>
                        <Col md={6}>
                          <Link
                            to={`/product/${item._id}`}
                            className='product-title text-light fw-bold'
                            style={{ textDecoration: 'none', fontSize: '1.1rem' }}
                          >
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4} className='text-end'>
                          <span style={{ fontSize: '1rem', color: '#cbd5e1' }}>
                            {item.qty} x {addCurrency(item.price)} ={' '}
                          </span>
                          <span className='fw-bold text-success' style={{ fontSize: '1.1rem' }}>
                            {addCurrency(item.qty * item.price)}
                          </span>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card className='border-0 overflow-hidden' style={{
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '15px',
          }}>
            <div className='p-4 border-bottom border-secondary' style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <h2 className='text-success fw-bold m-0'><i className='fas fa-file-invoice-dollar me-2'></i>Order Bill</h2>
            </div>
            <ListGroup variant='flush' className='p-2'>
              <ListGroup.Item className='bg-transparent text-light border-secondary border-0 pb-2'>
                <div className='mb-2' style={{ fontSize: '0.85rem', borderLeft: '2px solid rgba(52, 211, 153, 0.3)', paddingLeft: '10px' }}>
                  {cartItems.filter(item => item.selected !== false).map((item, index) => (
                    <div key={index} className='d-flex justify-content-between mb-1'>
                      <span className='text-truncate' style={{ maxWidth: '150px', color: '#94a3b8' }}>{item.name}</span>
                      <span style={{ color: '#cbd5e1' }}>{item.qty} × {addCurrency(item.price)}</span>
                    </div>
                  ))}
                </div>
                <Row>
                  <Col style={{ color: '#94a3b8' }}>Items Total:</Col>
                  <Col className='text-end' style={{ fontWeight: '600' }}>{addCurrency(Number(itemsPrice))}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className='bg-transparent text-light border-secondary border-0 py-2'>
                <Row>
                  <Col style={{ color: '#94a3b8' }}>Shipping:</Col>
                  <Col className='text-end' style={{ fontWeight: '600', color: Number(shippingPrice) === 0 ? '#34d399' : '#fff' }}>
                    {Number(shippingPrice) === 0 ? 'FREE' : addCurrency(Number(shippingPrice))}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className='bg-transparent text-light border-secondary border-0 py-2'>
                <Row>
                  <Col style={{ color: '#94a3b8' }}>Tax (18% GST):</Col>
                  <Col className='text-end' style={{ fontWeight: '600' }}>{addCurrency(Number(taxPrice))}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className='bg-transparent text-light border-0 py-3 mt-2' style={{
                background: 'rgba(16, 185, 129, 0.05)',
                borderRadius: '16px',
                border: '1px dashed rgba(52, 211, 153, 0.2)'
              }}>
                <Row className='align-items-center'>
                  <Col className='h4 mb-0' style={{ fontWeight: '800', fontSize: '1.2rem', color: '#94a3b8' }}>Grand Total</Col>
                  <Col className='h4 mb-0 text-end' style={{ fontWeight: '800', color: '#10b981', fontSize: '1.5rem' }}>{addCurrency(Number(totalPrice))}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className='bg-transparent border-0 pt-4'>
                <Button
                  className='w-100'
                  disabled={cartItems.filter(item => item.selected !== false).length === 0 || isLoading}
                  onClick={placeOrderHandler}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    fontWeight: '800',
                    padding: '14px',
                    fontSize: '1.2rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  Place Order
                </Button>
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderPage;
