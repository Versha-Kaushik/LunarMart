import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import FormContainer from '../components/FormContainer';
import Meta from '../components/Meta';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [sellerId, setSellerId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [registerType, setRegisterType] = useState('buyer');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector(state => state.auth);

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmShowPassword(!showConfirmPassword);
  };

  const toggleMobileVisibility = () => {
    setShowMobile(!showMobile);
  };

  const toggleAddressVisibility = () => {
    setShowAddress(!showAddress);
  };

  const submitHandler = async e => {
    e.preventDefault();
    if (registerType === 'buyer' && password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    } else {
      try {
        const payload = registerType === 'buyer'
          ? { name, email, password }
          : { name, email, sellerId };

        const res = await register(payload).unwrap();

        toast.success('Registration successful. Please login to continue.');
        navigate('/login');
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  return (
    <FormContainer>
      <Meta title={'Register'} />
      <div style={{ position: 'relative' }}>
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
      <h1 style={{ marginTop: '40px' }}>Register</h1><br />

      <div className="mb-4">
        <Form.Label style={{
          color: '#34d399',
          fontWeight: '600',
          fontSize: '1rem',
          marginBottom: '0.75rem',
          display: 'block'
        }}>
          Register As
        </Form.Label>
        <Row className="g-2">
          <Col xs={6}>
            <Button
              variant={registerType === 'buyer' ? 'success' : 'outline-success'}
              onClick={() => setRegisterType('buyer')}
              className="w-100"
              style={{
                backgroundColor: registerType === 'buyer' ? '#34d399' : 'transparent',
                borderColor: '#34d399',
                color: registerType === 'buyer' ? '#19224b' : '#34d399',
                fontWeight: '600',
                padding: '0.75rem',
                transition: 'all 0.3s',
                border: '2px solid #34d399'
              }}
            >
              Buyer
            </Button>
          </Col>
          <Col xs={6}>
            <Button
              variant={registerType === 'seller' ? 'success' : 'outline-success'}
              onClick={() => setRegisterType('seller')}
              className="w-100"
              style={{
                backgroundColor: registerType === 'seller' ? '#34d399' : 'transparent',
                borderColor: '#34d399',
                color: registerType === 'seller' ? '#19224b' : '#34d399',
                fontWeight: '600',
                padding: '0.75rem',
                transition: 'all 0.3s',
                border: '2px solid #34d399'
              }}
            >
              Seller
            </Button>
          </Col>
        </Row>
      </div>

      <Form onSubmit={submitHandler}>
        <Form.Group className='mb-3' controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            type='text'
            placeholder='Enter name'
            onChange={e => setName(e.target.value)}
            style={{ backgroundColor: '#102657', color: '#fff', border: '1px solid #89dabc' }}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='email'>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            value={email}
            type='email'
            placeholder='Enter email'
            onChange={e => setEmail(e.target.value)}
            style={{ backgroundColor: '#102657', color: '#fff', border: '1px solid #89dabc' }}
          />
        </Form.Group>

        {registerType === 'buyer' ? (
          <>
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
            <Form.Group className='mb-3' controlId='confirmPassword'>
              <Form.Label>Confirm Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  placeholder='Confirm password'
                  onChange={e => setConfirmPassword(e.target.value)}
                  style={{ backgroundColor: '#102657', color: '#fff', border: '1px solid #89dabc' }}
                />
                <InputGroup.Text
                  onClick={toggleConfirmPasswordVisibility}
                  id='toggleConfirmPasswordVisibility'
                  style={{ cursor: 'pointer' }}
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </>
        ) : (
          <Form.Group className='mb-3' controlId='sellerId'>
            <Form.Label>Seller ID</Form.Label>
            <Form.Control
              value={sellerId}
              type='text'
              placeholder='Enter your Seller ID'
              onChange={e => setSellerId(e.target.value)}
              style={{ backgroundColor: '#102657', color: '#fff', border: '1px solid #89dabc' }}
            />
          </Form.Group>
        )}

        <Form.Group className='mb-3' controlId='mobile'>
          <Form.Label>Mobile Number</Form.Label>
          <Form.Control
            value={mobile}
            type='number'
            placeholder='Enter mobile number'
            onChange={e => setMobile(e.target.value)}
            style={{ backgroundColor: '#102657', color: '#fff', border: '1px solid #89dabc' }}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='address'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            value={address}
            type='text'
            placeholder='Enter address'
            onChange={e => setAddress(e.target.value)}
            style={{ backgroundColor: '#102657', color: '#fff', border: '1px solid #89dabc' }}
          />
        </Form.Group>
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
          Register
        </Button>
      </Form>
      <Row>
        <Col>
          Already have an account?
          <Link
            to={redirect ? `/login?redirect=${redirect}` : '/login'}
            className=' mx-2'
          >
            Sign In
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterPage;
