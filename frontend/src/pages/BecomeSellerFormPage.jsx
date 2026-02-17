import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Meta from '../components/Meta';
import axios from 'axios';
import { BASE_URL, SELLER_URL } from '../constants';

const BecomeSellerFormPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    businessName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    category: 'decorations',
    experience: '',
    website: '',
    lastYearSales: '',
    lastMonthSales: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('==== LUNARMART SELLER APPLICATION SUBMISSION ====');
      const submitUrl = `${BASE_URL}${SELLER_URL}/apply`;
      console.log('Submission Endpoint:', submitUrl);
      console.log('Application Payload:', formData);

      const response = await axios.post(submitUrl, formData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true 
      });

      console.log('Submission Successful:', response.status);
      console.log('Server Payload:', response.data);

      if (response.data.success) {
        toast.success(response.data.message || 'Application submitted successfully!');
        navigate('/become-seller/success', {
          state: {
            email: formData.email,
            businessName: formData.businessName,
            sellerId: response.data.data.sellerId
          }
        });
      }
    } catch (error) {
      console.error('==== SUBMISSION FAILED ====');

      let errorMessage = 'Failed to submit application. Please check your connection.';

      if (error.response) {
        console.error('Server Error Status:', error.response.status);
        console.error('Server Error Data:', error.response.data);
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        console.error('No Response Received:', error.request);
        errorMessage = 'Server is not responding. Please try again later.';
      } else {
        console.error('Request Setup Error:', error.message);
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Meta title='Be a Seller' />
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
          title='Back to Home'
        >
          <FaArrowLeft />
        </Button>
      </div>
      <style>
        {`
          .seller-form-input::placeholder {
            color: #94a3b8 !important;
            opacity: 1 !important;
          }
          .seller-form-input::-webkit-input-placeholder {
            color: #94a3b8 !important;
            opacity: 1 !important;
          }
          .seller-form-input::-moz-placeholder {
            color: #94a3b8 !important;
            opacity: 1 !important;
          }
          .seller-form-input:-ms-input-placeholder {
            color: #94a3b8 !important;
            opacity: 1 !important;
          }
        `}
      </style>
      <Container className='py-5'>
        <Row className='mb-4'>
          <Col lg={8} className='mx-auto text-center'>
            <h1 style={{
              background: 'linear-gradient(135deg, #34d399, #22d3ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '2.2rem',
              fontWeight: '800'
            }}>
              Apply to Become a Seller
            </h1>
            <p className='mt-3' style={{ fontSize: '1.05rem', color: '#cbd5e1' }}>
              Share your store details and we will reach out within 48 hours.
            </p>
          </Col>
        </Row>

        <Row>
          <Col lg={8} className='mx-auto'>
            <Card style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
              border: '2px solid rgba(52, 211, 153, 0.4)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
            }}>
              <Card.Body style={{ padding: '2.5rem' }}>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className='mb-4'>
                    <Form.Label style={{ color: '#34d399', fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem' }}>
                      Full Name *
                    </Form.Label>
                    <Form.Control
                      type='text'
                      name='name'
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder='Enter your full name'
                      required
                      className='seller-form-input'
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: '2px solid rgba(52, 211, 153, 0.6)',
                        color: '#e2e8f0',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className='mb-4'>
                        <Form.Label style={{ color: '#34d399', fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem' }}>
                          Date of Birth *
                        </Form.Label>
                        <Form.Control
                          type='date'
                          name='dob'
                          value={formData.dob}
                          onChange={handleInputChange}
                          required
                          className='seller-form-input'
                          style={{
                            backgroundColor: 'rgba(15, 23, 42, 0.95)',
                            border: '2px solid rgba(52, 211, 153, 0.6)',
                            color: '#e2e8f0',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            fontSize: '1rem'
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className='mb-4'>
                        <Form.Label style={{ color: '#34d399', fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem' }}>
                          Gender *
                        </Form.Label>
                        <Form.Select
                          name='gender'
                          value={formData.gender}
                          onChange={handleInputChange}
                          required
                          className='seller-form-input'
                          style={{
                            backgroundColor: 'rgba(15, 23, 42, 0.95)',
                            border: '2px solid rgba(52, 211, 153, 0.6)',
                            color: '#e2e8f0',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            fontSize: '1rem'
                          }}
                        >
                          <option value=''>Select gender</option>
                          <option value='male'>Male</option>
                          <option value='female'>Female</option>
                          <option value='other'>Other</option>
                          <option value='prefer-not-to-say'>Prefer not to say</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className='mb-4'>
                    <Form.Label style={{ color: '#34d399', fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem' }}>
                      Email Address *
                    </Form.Label>
                    <Form.Control
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder='your@email.com'
                      required
                      className='seller-form-input'
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: '2px solid rgba(52, 211, 153, 0.6)',
                        color: '#e2e8f0',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className='mb-4'>
                    <Form.Label style={{ color: '#34d399', fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem' }}>
                      Phone Number *
                    </Form.Label>
                    <Form.Control
                      type='tel'
                      name='phone'
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder='+91 XXXXX XXXXX'
                      required
                      className='seller-form-input'
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: '2px solid rgba(52, 211, 153, 0.6)',
                        color: '#e2e8f0',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className='mb-4'>
                    <Form.Label style={{ color: '#34d399', fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem' }}>
                      Business/Company Name *
                    </Form.Label>
                    <Form.Control
                      type='text'
                      name='businessName'
                      value={formData.businessName}
                      onChange={handleInputChange}
                      placeholder='Enter your registered business name'
                      required
                      className='seller-form-input'
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: '2px solid rgba(52, 211, 153, 0.6)',
                        color: '#e2e8f0',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className='mb-4'>
                    <Form.Label style={{ color: '#34d399', fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem' }}>
                      Business Address *
                    </Form.Label>
                    <Form.Control
                      type='text'
                      name='address'
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder='Street address, building number'
                      required
                      className='seller-form-input'
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: '2px solid rgba(52, 211, 153, 0.6)',
                        color: '#e2e8f0',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className='mb-4'>
                        <Form.Label style={{ color: '#34d399', fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem' }}>
                          City *
                        </Form.Label>
                        <Form.Control
                          type='text'
                          name='city'
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder='Enter city'
                          required
                          className='seller-form-input'
                          style={{
                            backgroundColor: 'rgba(15, 23, 42, 0.95)',
                            border: '2px solid rgba(52, 211, 153, 0.6)',
                            color: '#e2e8f0',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            fontSize: '1rem'
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className='mb-4'>
                        <Form.Label style={{ color: '#34d399', fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem' }}>
                          State *
                        </Form.Label>
                        <Form.Control
                          type='text'
                          name='state'
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder='Enter state'
                          required
                          className='seller-form-input'
                          style={{
                            backgroundColor: 'rgba(15, 23, 42, 0.95)',
                            border: '2px solid rgba(52, 211, 153, 0.6)',
                            color: '#e2e8f0',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            fontSize: '1rem'
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className='mb-4'>
                    <Form.Label style={{ color: '#34d399', fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem' }}>
                      Pincode *
                    </Form.Label>
                    <Form.Control
                      type='text'
                      name='pincode'
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder='Enter 6-digit pincode'
                      required
                      pattern='[0-9]{6}'
                      className='seller-form-input'
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: '2px solid rgba(52, 211, 153, 0.6)',
                        color: '#e2e8f0',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className='mb-4'>
                    <Form.Label style={{ color: '#34d399', fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem' }}>
                      Primary Category *
                    </Form.Label>
                    <Form.Select
                      name='category'
                      value={formData.category}
                      onChange={handleInputChange}
                      className='seller-form-input'
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: '2px solid rgba(52, 211, 153, 0.6)',
                        color: '#e2e8f0',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    >
                      <option value='decorations'>Home Decorations</option>
                      <option value='lighting'>Lighting</option>
                      <option value='wall-art'>Wall Art</option>
                      <option value='vases'>Vases</option>
                      <option value='scented-candles'>Scented Candles</option>
                      <option value='pillows'>Pillows</option>
                      <option value='mirrors'>Mirrors</option>
                      <option value='other'>Other</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className='mb-4'>
                    <Form.Label style={{ color: '#34d399', fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem' }}>
                      Years of Experience *
                    </Form.Label>
                    <Form.Select
                      name='experience'
                      value={formData.experience}
                      onChange={handleInputChange}
                      required
                      className='seller-form-input'
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: '2px solid rgba(52, 211, 153, 0.6)',
                        color: '#e2e8f0',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    >
                      <option value=''>Select experience</option>
                      <option value='less-than-1'>Less than 1 year</option>
                      <option value='1-3'>1-3 years</option>
                      <option value='3-5'>3-5 years</option>
                      <option value='5-10'>5-10 years</option>
                      <option value='10+'>10+ years</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className='mb-4'>
                    <Form.Label style={{ color: '#34d399', fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem' }}>
                      Website / Social Media
                    </Form.Label>
                    <Form.Control
                      type='url'
                      name='website'
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder='https://yourwebsite.com or social media link'
                      className='seller-form-input'
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: '2px solid rgba(52, 211, 153, 0.6)',
                        color: '#e2e8f0',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className='mb-4'>
                    <Form.Label style={{ color: '#34d399', fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem' }}>
                      Last Year Sales (₹)
                    </Form.Label>
                    <Form.Control
                      type='number'
                      name='lastYearSales'
                      value={formData.lastYearSales}
                      onChange={handleInputChange}
                      placeholder='Enter total sales from last year'
                      min='0'
                      className='seller-form-input'
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: '2px solid rgba(52, 211, 153, 0.6)',
                        color: '#e2e8f0',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className='mb-4'>
                    <Form.Label style={{ color: '#34d399', fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem' }}>
                      Last Month Sales (₹)
                    </Form.Label>
                    <Form.Control
                      type='number'
                      name='lastMonthSales'
                      value={formData.lastMonthSales}
                      onChange={handleInputChange}
                      placeholder='Enter total sales from last month'
                      min='0'
                      className='seller-form-input'
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: '2px solid rgba(52, 211, 153, 0.6)',
                        color: '#e2e8f0',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className='mb-4'>
                    <Form.Label style={{ color: '#34d399', fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem' }}>
                      Additional Information
                    </Form.Label>
                    <Form.Control
                      as='textarea'
                      name='message'
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder='Tell us about your business and products...'
                      rows={4}
                      className='seller-form-input'
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: '2px solid rgba(52, 211, 153, 0.6)',
                        color: '#e2e8f0',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </Form.Group>

                  <Button
                    variant='success'
                    type='submit'
                    size='lg'
                    className='w-100'
                    disabled={isSubmitting}
                    style={{
                      background: 'linear-gradient(135deg, #34d399, #22d3ee)',
                      border: 'none',
                      fontWeight: '800',
                      padding: '14px',
                      fontSize: '1.1rem',
                      borderRadius: '8px',
                      boxShadow: '0 4px 15px rgba(52, 211, 153, 0.4)',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Submitting Application...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
            <p className='text-center mt-4' style={{ fontSize: '0.95rem', color: '#cbd5e1' }}>
              * Fields are required. We will review your application and contact you within 48 hours.
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default BecomeSellerFormPage;
