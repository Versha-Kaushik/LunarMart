import React, { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import Meta from '../components/Meta';
import { FaArrowLeft } from 'react-icons/fa';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { shippingAddress } = useSelector(state => state.cart);

  useEffect(() => {
    if (!shippingAddress) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = e => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/place-order');
  };
  return (
    <FormContainer>
      <Meta title={'Payment Method'} />
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
        <h1 className='fw-bold m-0' style={{ color: '#fff' }}>Payment</h1>
      </div>

      <div className='p-4 p-md-5 shadow-lg border-0' style={{
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '24px'
      }}>
        <Form onSubmit={submitHandler}>
          <Form.Group className='mb-5'>
            <Form.Label as='legend' style={{ color: '#94a3b8', fontWeight: '600', marginBottom: '20px' }}>Select Method</Form.Label>
            <Col>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                cursor: 'pointer'
              }}>
                <Form.Check
                  className='my-2 fw-bold text-light'
                  type='radio'
                  id='COD'
                  label='Cash on Delivery'
                  name='paymentMethod'
                  value='Cash on Delivery'
                  checked
                  onChange={e => setPaymentMethod(e.target.value)}
                  style={{ transform: 'scale(1.1)' }}
                ></Form.Check>
              </div>
            </Col>
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
            Continue to Place Order
          </Button>
        </Form>
      </div>
    </FormContainer>
  );
};

export default Payment;
