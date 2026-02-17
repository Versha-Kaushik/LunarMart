import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../slices/cartSlice';
import FormContainer from '../components/FormContainer';
import Meta from '../components/Meta';
import { FaArrowLeft } from 'react-icons/fa';

const ShippingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shippingAddress } = useSelector(state => state.cart);

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [country, setCountry] = useState(shippingAddress.country || '');

  const submitHandler = e => {
    e.preventDefault();
    dispatch(
      saveShippingAddress({
        address,
        city,
        postalCode,
        country
      })
    );
    navigate('/payment');
  };
  return (
    <FormContainer>
      <Meta title={'Shipping'} />
      <div style={{ position: 'relative', textAlign: 'center', marginBottom: '30px' }}>
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
        <h1 className='fw-bold m-0' style={{ color: '#fff' }}>Shipping</h1>
      </div>

      <div className='p-4 p-md-5 shadow-lg border-0' style={{
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '24px'
      }}>
        <Form onSubmit={submitHandler}>
          <Form.Group className='mb-4' controlId='address'>
            <Form.Label style={{ color: '#94a3b8', fontWeight: '600' }}>Address</Form.Label>
            <Form.Control
              value={address}
              type='text'
              placeholder='Enter your full address'
              onChange={e => setAddress(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                color: '#fff',
                borderRadius: '12px',
                padding: '12px'
              }}
              required
            />
          </Form.Group>
          <Form.Group className='mb-4' controlId='city'>
            <Form.Label style={{ color: '#94a3b8', fontWeight: '600' }}>City</Form.Label>
            <Form.Control
              value={city}
              type='text'
              placeholder='Enter city'
              onChange={e => setCity(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                color: '#fff',
                borderRadius: '12px',
                padding: '12px'
              }}
              required
            />
          </Form.Group>
          <Form.Group className='mb-4' controlId='postalCode'>
            <Form.Label style={{ color: '#94a3b8', fontWeight: '600' }}>Postal Code</Form.Label>
            <Form.Control
              value={postalCode}
              type='text'
              placeholder='Enter postal code'
              onChange={e => setPostalCode(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                color: '#fff',
                borderRadius: '12px',
                padding: '12px'
              }}
              required
            />
          </Form.Group>
          <Form.Group className='mb-5' controlId='country'>
            <Form.Label style={{ color: '#94a3b8', fontWeight: '600' }}>Country</Form.Label>
            <Form.Control
              value={country}
              type='text'
              placeholder='Enter country'
              onChange={e => setCountry(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                color: '#fff',
                borderRadius: '12px',
                padding: '12px'
              }}
              required
            />
          </Form.Group>
          <Button
            className='w-100'
            type='submit'
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
            Continue to Payment
          </Button>
        </Form>
      </div>
    </FormContainer>
  );
};

export default ShippingPage;
