import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, InputGroup, ButtonGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { syncWishlist } from '../slices/wishlistSlice';
import { syncCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaArrowLeft, FaShoppingCart, FaStore } from 'react-icons/fa';
import FormContainer from '../components/FormContainer';
import Meta from '../components/Meta';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sellerIdInput, setSellerIdInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loginType, setLoginType] = useState('buyer');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector(state => state.auth);

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const redirect = searchParams.get('redirect') || '/';

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const submitHandler = async e => {
    e.preventDefault();
    try {
      const normalizedEmail = email.toLowerCase().trim();
      const normalizedSellerId = sellerIdInput.trim();

      const data = loginType === 'seller'
        ? { email: normalizedEmail, sellerId: normalizedSellerId }
        : { email: normalizedEmail, password, remember };

      const res = await login(data).unwrap();
      dispatch(setCredentials({ ...res }));

      const storedUserWishlist = localStorage.getItem(`wishlist-${res._id}`);
      const userWishlist = storedUserWishlist ? JSON.parse(storedUserWishlist) : [];
      dispatch(syncWishlist(userWishlist));
      const storedUserCart = localStorage.getItem(`cart-${res._id}`);
      const userCart = storedUserCart ? JSON.parse(storedUserCart) : { cartItems: [], shippingAddress: {}, paymentMethod: {} };
      dispatch(syncCart(userCart));

      if (loginType === 'seller') {
        if (res.isSeller) {
          navigate('/seller/home');
          toast.success('Welcome to Seller Dashboard!');
        } else {
          toast.error('This account is not registered as a seller. Please apply to become a seller first.');
          navigate('/');
        }
      } else {
        navigate(redirect);
        toast.success('Login successful');
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };
  return (
    <FormContainer>
      <Meta title={'Sign In'} />
      <div style={{ marginTop: '20px', position: 'relative', textAlign: 'center' }}>
        <Button
          variant='link'
          style={{
            position: 'absolute',
            left: '-400px',
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
      </div>
      <h1 style={{ marginTop: '40px' }}>Sign In</h1><br />

      <div className="mb-4">
        <Form.Label style={{
          color: '#34d399',
          fontWeight: '600',
          fontSize: '1rem',
          marginBottom: '0.75rem',
          display: 'block'
        }}>
          Login As
        </Form.Label>
        <ButtonGroup className="w-100">
          <Button
            variant={loginType === 'buyer' ? 'success' : 'outline-success'}
            onClick={() => setLoginType('buyer')}
            style={{
              backgroundColor: loginType === 'buyer' ? '#34d399' : 'transparent',
              borderColor: '#34d399',
              color: loginType === 'buyer' ? '#19224b' : '#34d399',
              fontWeight: '600',
              padding: '0.75rem',
              transition: 'all 0.3s',
              border: '2px solid #34d399'
            }}
          >
            <FaShoppingCart className="me-2" />
            Buyer
          </Button>
          <Button
            variant={loginType === 'seller' ? 'success' : 'outline-success'}
            onClick={() => setLoginType('seller')}
            style={{
              backgroundColor: loginType === 'seller' ? '#34d399' : 'transparent',
              borderColor: '#34d399',
              color: loginType === 'seller' ? '#19224b' : '#34d399',
              fontWeight: '600',
              padding: '0.75rem',
              transition: 'all 0.3s',
              border: '2px solid #34d399'
            }}
          >
            <FaStore className="me-2" />
            Seller
          </Button>
        </ButtonGroup>
        {loginType === 'seller' && (
          <small style={{ color: '#94a3b8', display: 'block', marginTop: '0.5rem' }}>
            Note: You must have an approved seller account to access the seller dashboard.
          </small>
        )}
      </div>

      <Form onSubmit={submitHandler}>
        <Form.Group className='mb-3' controlId='email'>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type='email'
            value={email}
            placeholder='Enter email'
            onChange={e => setEmail(e.target.value)}
            style={{ backgroundColor: '#102657', color: '#fff', border: '1px solid #89dabc' }}
          />
        </Form.Group>

        {loginType === 'buyer' ? (
          <Form.Group className='mb-3' controlId='password'>
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                value={password}
                placeholder='Enter password'
                onChange={e => setPassword(e.target.value)}
                style={{ backgroundColor: '#102657', color: '#fff', border: '1px solid #89dabc' }}
              />
              <InputGroup.Text
                onClick={togglePasswordVisibility}
                id='togglePasswordVisibility'
                style={{ cursor: 'pointer' }}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
        ) : (
          <Form.Group className='mb-3' controlId='sellerId'>
            <Form.Label>Seller ID</Form.Label>
            <Form.Control
              type='text'
              value={sellerIdInput}
              placeholder='Enter your Seller ID'
              onChange={e => setSellerIdInput(e.target.value)}
              style={{ backgroundColor: '#102657', color: '#fff', border: '1px solid #89dabc' }}
            />
          </Form.Group>
        )}
        <br />
        <Button
          className='mb-3 w-100'
          variant='warning'
          type='submit'
          disabled={isLoading}
          style={{
            backgroundColor: '#34d399',
            color: '#19224b',
            border: '5px solid #89dabc',
            padding: '8px 12px',
            fontSize: '1.3rem',
            zIndex: 10,
            textDecoration: 'none'
          }}
        >
          Sign In
        </Button>
      </Form>
      <Row>
        <Col>
          New Customer?
          <Link
            to={redirect ? `/register?redirect=${redirect}` : '/register'}
            className=' mx-2'
          >
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer >
  );
};

export default LoginPage;
