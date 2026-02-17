import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';
import {
  Row,
  Col,
  Card,
  Button,
  ButtonGroup,
  ListGroup,
  Form,
  Modal
} from 'react-bootstrap';
import { addToCart, removeFromCart, toggleSelectItem, selectOnlyItem, saveShippingAddress, savePaymentMethod } from '../slices/cartSlice';
import Meta from '../components/Meta';
import { addCurrency } from '../utils/addCurrency';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice, shippingAddress, paymentMethod: savedPaymentMethod } = useSelector(state => state.cart);
  const { userInfo } = useSelector(state => state.auth);

  const [showModal, setShowModal] = React.useState(false);
  const [isSingleItem, setIsSingleItem] = React.useState(false);
  const [selectedProductId, setSelectedProductId] = React.useState(null);
  const [name, setName] = React.useState(shippingAddress?.name || userInfo?.name || '');
  const [address, setAddress] = React.useState(shippingAddress?.address || '');
  const [city, setCity] = React.useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = React.useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = React.useState(shippingAddress?.country || '');
  const [paymentMethod, setPaymentMethod] = React.useState(savedPaymentMethod || 'Cash on Delivery');

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = async id => {
    dispatch(removeFromCart(id));
  };

  const calculateShipping = () => shippingPrice;
  const calculateTotal = () => totalPrice;

  const handleCheckoutTrigger = (productId = null) => {
    if (!userInfo) {
      navigate(`/login?redirect=cart`);
      return;
    }

    if (productId) {
      setIsSingleItem(true);
      setSelectedProductId(productId);
      dispatch(selectOnlyItem(productId));
    } else {
      setIsSingleItem(false);
      setSelectedProductId(null);
    }
    setShowModal(true);
  };

  const checkoutHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ name, address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    setShowModal(false);
    navigate('/place-order');
  };

  return (
    <>
      <Meta title={'Your Cart'} />

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
      >
        <Modal.Body style={{
          background: 'rgba(15, 23, 42, 0.95)',
          color: '#fff',
          borderRadius: '15px',
          border: '1px solid rgba(52, 211, 153, 0.3)',
          padding: '30px'
        }}>
          <h2 className='text-center mb-4 fw-bold' style={{ color: '#10b981' }}>Order preview</h2>
          <Form onSubmit={checkoutHandler}>
            <Row>
              <Col md={6}>
                <h5 className='mb-3 text-info fw-bold'>Shipping Details</h5>
                <Form.Group className='mb-3'>
                  <Form.Label style={{ color: '#94a3b8' }}>Full Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter your name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(148, 163, 184, 0.3)', color: '#fff', borderRadius: '10px' }}
                    required
                  />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label style={{ color: '#94a3b8' }}>Address</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter address'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(148, 163, 184, 0.3)', color: '#fff', borderRadius: '10px' }}
                    required
                  />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label style={{ color: '#94a3b8' }}>City</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter city'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(148, 163, 184, 0.3)', color: '#fff', borderRadius: '10px' }}
                    required
                  />
                </Form.Group>
                <div className='d-flex gap-2'>
                  <Form.Group className='mb-3 w-100'>
                    <Form.Label style={{ color: '#94a3b8' }}>Postal Code</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Pin'
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(148, 163, 184, 0.3)', color: '#fff', borderRadius: '10px' }}
                      required
                    />
                  </Form.Group>
                  <Form.Group className='mb-3 w-100'>
                    <Form.Label style={{ color: '#94a3b8' }}>Country</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Country'
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(148, 163, 184, 0.3)', color: '#fff', borderRadius: '10px' }}
                      required
                    />
                  </Form.Group>
                </div>
              </Col>
              <Col md={6}>
                <h5 className='mb-3 text-info fw-bold'>Payment Method</h5>
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(52, 211, 153, 0.2)'
                }}>
                  <Form.Check
                    type='radio'
                    label='Cash on Delivery'
                    id='cod'
                    name='paymentMethod'
                    value='Cash on Delivery'
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ transform: 'scale(1.1)' }}
                  />
                </div>
              </Col>
            </Row>
            <Button
              type='submit'
              className='w-100 mt-4'
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                fontWeight: '800',
                padding: '14px',
                fontSize: '1.2rem',
                borderRadius: '12px'
              }}
            >
              Preview Order
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

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
          onClick={() => navigate('/')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(-5px)';
            e.currentTarget.style.color = '#10b981';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.color = '#34d399';
          }}
          title='Go Back Home'
        >
          <FaArrowLeft />
        </Button>
        <h1 style={{ marginTop: '0', marginBottom: '30px', color: '#e2e8f0' }}>Your Cart</h1>
      </div>
      <Row>
        <Col md={12}>
          {cartItems.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 40px',
              borderRadius: '15px',
              border: '2px solid rgba(52, 211, 153, 0.3)',
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              marginTop: '40px'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px', color: '#34d399' }}>🛒</div>
              <p style={{ fontSize: '1.3rem', marginBottom: '30px', color: '#e2e8f0', fontWeight: '600' }}>Your cart is empty</p>
              <p style={{ fontSize: '1rem', marginBottom: '30px', color: '#94a3b8' }}>Start exploring our amazing products</p>
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
                Get Started
              </Button>
            </div>
          ) : (
            <>
              <Row className='g-4'>
                <Col md={8}>
                  <Row className='g-4'>
                    {cartItems.map(item => (
                      <Col sm={12} lg={6} key={item._id}>
                        <Card className='h-100 shadow-lg border-0' style={{
                          transition: 'transform 0.3s',
                          background: 'rgba(15, 23, 42, 0.6)',
                          backdropFilter: 'blur(10px)',
                          border: `1px solid ${item.selected !== false ? 'rgba(52, 211, 153, 0.5)' : 'rgba(148, 163, 184, 0.2)'}`,
                          borderRadius: '16px',
                          opacity: item.selected !== false ? 1 : 0.8
                        }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-8px)')}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
                          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10 }}>
                            <Form.Check
                              type='checkbox'
                              checked={item.selected !== false}
                              onChange={() => dispatch(toggleSelectItem(item._id))}
                              style={{ transform: 'scale(1.5)', cursor: 'pointer' }}
                              title='Select for checkout'
                            />
                          </div>
                          <Card.Img
                            variant='top'
                            src={item.image}
                            style={{ height: '180px', objectFit: 'cover', borderRadius: '16px 16px 0 0', filter: item.selected !== false ? 'none' : 'grayscale(50%)' }}
                          />
                          <Card.Body>
                            <Card.Title style={{ color: '#fff', fontWeight: '700', fontSize: '1.1rem' }}>
                              {item.name}
                            </Card.Title>
                            <div className='d-flex justify-content-between align-items-center mb-2'>
                              <Card.Subtitle className='text-info fw-bold'>{addCurrency(item.price)}</Card.Subtitle>
                              <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Stock: {item.countInStock}</span>
                            </div>
                            <div className='d-flex justify-content-between align-items-center mb-0'>
                              <ButtonGroup size='sm' style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
                                <Button
                                  variant='dark'
                                  onClick={() => addToCartHandler(item, Math.max(1, item.qty - 1))}
                                  disabled={item.qty <= 1}
                                  style={{ border: 'none', background: 'transparent' }}
                                >
                                  -
                                </Button>
                                <Button variant='dark' disabled style={{ minWidth: '40px', border: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
                                  {item.qty}
                                </Button>
                                <Button
                                  variant='dark'
                                  onClick={() => addToCartHandler(item, Math.min(item.countInStock, item.qty + 1))}
                                  disabled={item.qty >= item.countInStock}
                                  style={{ border: 'none', background: 'transparent' }}
                                >
                                  +
                                </Button>
                              </ButtonGroup>
                            </div>
                          </Card.Body>
                          <div className='p-3 pt-0 d-flex gap-2 align-items-center'>
                            <Button
                              onClick={() => handleCheckoutTrigger(item._id)}
                              style={{
                                flex: 1,
                                background: 'linear-gradient(135deg, #6366f1, #4338ca)',
                                border: 'none',
                                fontWeight: '700',
                                padding: '12px',
                                fontSize: '0.9rem',
                                borderRadius: '12px',
                                transition: 'all 0.3s',
                                boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 15px rgba(99, 102, 241, 0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 10px rgba(99, 102, 241, 0.2)';
                              }}
                            >
                              Buy Now
                            </Button>
                            <Button
                              onClick={() => removeFromCartHandler(item._id)}
                              style={{
                                flex: 1,
                                background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                                border: 'none',
                                fontWeight: '700',
                                padding: '12px',
                                fontSize: '0.9rem',
                                borderRadius: '12px',
                                transition: 'all 0.3s',
                                boxShadow: '0 4px 10px rgba(244, 63, 94, 0.2)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 15px rgba(244, 63, 94, 0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 10px rgba(244, 63, 94, 0.2)';
                              }}
                              title='Remove Item'
                            >
                              <FaTrash className='me-1' /> Remove
                            </Button>
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Col>
                <Col md={4}>
                  <Card className='shadow-lg border-0' style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(52, 211, 153, 0.2)',
                    borderRadius: '20px',
                    padding: '25px',
                    position: 'sticky',
                    top: '100px'
                  }}>
                    <Card.Body className='p-0'>
                      <h4 style={{ color: '#fff', fontWeight: '800', marginBottom: '20px' }}>Selected Items</h4>
                      <div className='d-flex justify-content-between mb-2' style={{ color: '#94a3b8' }}>
                        <span>Items ({cartItems.filter(i => i.selected !== false).reduce((acc, item) => acc + item.qty, 0)}):</span>
                        <span>{addCurrency(cartItems.filter(i => i.selected !== false).reduce((acc, item) => acc + item.qty * item.price, 0))}</span>
                      </div>
                      <div className='d-flex justify-content-between mb-2' style={{ color: '#94a3b8' }}>
                        <span>Shipping:</span>
                        <span style={{ color: '#34d399' }}>{Number(calculateShipping()) === 0 ? 'FREE' : addCurrency(calculateShipping())}</span>
                      </div>
                      <div className='d-flex justify-content-between mb-4' style={{ color: '#94a3b8' }}>
                        <span>Tax (18% GST):</span>
                        <span>{addCurrency(taxPrice)}</span>
                      </div>
                      <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                      <div className='d-flex justify-content-between mb-4' style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '800' }}>
                        <span>Total:</span>
                        <span style={{ color: '#34d399' }}>{addCurrency(calculateTotal())}</span>
                      </div>
                      <Button
                        onClick={() => handleCheckoutTrigger()}
                        disabled={cartItems.filter(i => i.selected !== false).length === 0}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          border: 'none',
                          fontWeight: '800',
                          padding: '14px',
                          fontSize: '1.2rem',
                          borderRadius: '12px',
                          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        Proceed to Pay
                      </Button>
                      <p style={{ color: '#64748b', fontSize: '0.8rem', textAlign: 'center', marginTop: '15px' }}>
                        {cartItems.some(i => i.selected === false) ? 'Note: Unselected items will remain in cart.' : 'Payment Method: Cash on Delivery'}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Col>
      </Row>
    </>
  );
};

export default CartPage;
