import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaIdCard, FaCopy } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Meta from '../components/Meta';

const SellerApplicationSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  const { sellerId, email, businessName } = location.state || {};

  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (!sellerId) {
      navigate('/become-seller/apply');
    }

    if (timeLeft === 0) {
      navigate('/');
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [sellerId, navigate, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleCopySellerId = () => {
    navigator.clipboard.writeText(sellerId);
    setCopied(true);
    toast.success('Seller ID copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!sellerId) return null;

  return (
    <>
      <Meta title='LunarMart | Application Submitted' />
      <Container className='py-5'>
        <Row className='justify-content-center'>
          <Col md={10} lg={8}>
            <Card className='shadow-lg text-center' style={{
              background: 'rgba(30, 41, 59, 0.9)',
              border: '2px solid rgba(52, 211, 153, 0.5)',
              borderRadius: '16px'
            }}>
              <Card.Body className='p-5'>
                <div className='mb-4'>
                  <FaCheckCircle size={80} style={{ color: '#34d399' }} />
                </div>
                <h2 style={{
                  background: 'linear-gradient(135deg, #34d399, #22d3ee)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: '800',
                  marginBottom: '20px'
                }}>
                  Application Submitted Successfully!
                </h2>
                <p className='mb-4' style={{ fontSize: '1.1rem', color: '#e2e8f0' }}>
                  Thank you for your interest in becoming a seller on LunarMart, <strong>{businessName}</strong>!
                </p>

                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  padding: '10px',
                  marginBottom: '20px',
                  display: 'inline-block'
                }}>
                  <p className='mb-0' style={{ color: '#f87171', fontWeight: 'bold' }}>
                    This page will close in {formatTime(timeLeft)}
                  </p>
                </div>

                <Card className='mb-4' style={{
                  background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.2), rgba(34, 211, 238, 0.2))',
                  border: '2px solid rgba(52, 211, 153, 0.6)',
                  borderRadius: '12px'
                }}>
                  <Card.Body className='p-4'>
                    <div className='d-flex align-items-center justify-content-center mb-2'>
                      <FaIdCard size={24} style={{ color: '#34d399', marginRight: '10px' }} />
                      <h4 style={{ margin: 0, color: '#34d399' }}>Your Seller ID</h4>
                    </div>
                    <div className='d-flex align-items-center justify-content-center gap-3'>
                      <h2 style={{
                        fontFamily: 'monospace',
                        color: '#22d3ee',
                        fontWeight: '800',
                        letterSpacing: '2px',
                        margin: 0,
                        fontSize: '1.8rem'
                      }}>
                        {sellerId}
                      </h2>
                      <Button
                        variant='outline-success'
                        size='sm'
                        onClick={handleCopySellerId}
                        style={{
                          borderColor: '#34d399',
                          color: '#34d399',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <FaCopy /> {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>

                  </Card.Body>
                </Card>

                <div style={{
                  background: 'rgba(52, 211, 153, 0.1)',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '30px',
                  textAlign: 'left'
                }}>
                  <h5 style={{ color: '#34d399', marginBottom: '15px' }}>📋 What Happens Next?</h5>
                  <ul style={{ color: '#e2e8f0', paddingLeft: '20px', marginBottom: 0 }}>
                    <li style={{ marginBottom: '10px' }}>
                      <strong>Review Process:</strong> Our team will review your application within <Badge bg="success">48 hours</Badge>
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <strong>Email Notification:</strong> You'll receive an email about your application status
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <strong>Seller Login:</strong> Once approved, use your Seller ID to log in and start selling
                    </li>
                    <li>
                      <strong>Dashboard Access:</strong> Manage your products, orders, and analytics from your seller dashboard
                    </li>
                  </ul>
                </div>

                <div style={{
                  background: 'rgba(34, 211, 238, 0.1)',
                  border: '1px solid rgba(34, 211, 238, 0.3)',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '30px'
                }}>
                  <p style={{ color: '#22d3ee', marginBottom: 0, fontSize: '0.95rem' }}>
                    <strong>💡 Important:</strong> Please save your Seller ID (<strong>{sellerId}</strong>) in a secure place.
                    You'll need it to access your seller account once your application is approved.
                  </p>
                </div>

                <div className='d-grid gap-2'>
                  <Button
                    size='lg'
                    onClick={() => navigate('/')}
                    style={{
                      background: 'linear-gradient(135deg, #34d399, #22d3ee)',
                      border: 'none',
                      fontWeight: '700',
                      padding: '12px'
                    }}
                  >
                    Back to Home
                  </Button>
                  <Button
                    variant='outline-secondary'
                    onClick={() => navigate('/become-seller')}
                    style={{
                      borderColor: '#34d399',
                      color: '#34d399',
                      fontWeight: '600'
                    }}
                  >
                    Learn More About Selling
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SellerApplicationSuccessPage;
