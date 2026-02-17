import React, { useState } from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import Meta from '../components/Meta';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { userInfo } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [showImageModal, setShowImageModal] = useState(false);

  return (
    <>
      <Row className='mt-5'>
        <Meta title={'User Profile'} />
        <Col md={12}>
          <Row className='g-4'>
            <Col sm={12} md={4}>
              <Card
                className='h-100 shadow-lg'
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundImage: 'url(https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=400&fit=crop)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '350px',
                  border: '3px solid #3b82f640',
                  borderRadius: '15px',
                  boxShadow: '0 4px 15px #3b82f630'
                }}
                onClick={() => navigate('/profile/view')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 30px #3b82f680, 0 0 25px #3b82f660';
                  e.currentTarget.style.border = '3px solid #3b82f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px #3b82f630';
                  e.currentTarget.style.border = '3px solid #3b82f640';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(0,0,0,0.75) 0%, #3b82f640 100%)',
                  zIndex: 1,
                  transition: 'all 0.3s ease'
                }} />

                <Card.Body className='text-center position-relative d-flex flex-column justify-content-center' style={{ zIndex: 2, padding: '2rem' }}>
                  <Card.Title style={{
                    color: '#ffffff',
                    fontWeight: '800',
                    fontSize: '1.5rem',
                    textShadow: '0 2px 8px rgba(0,0,0,0.7), 0 0 15px #3b82f680',
                    marginBottom: '1rem',
                    letterSpacing: '0.5px'
                  }}>
                    View Profile
                  </Card.Title>
                  <Card.Text className='text-light' style={{
                    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                    fontSize: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    See your profile information
                  </Card.Text>
                  <Badge
                    pill
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #3b82f6CC)',
                      fontSize: '0.95rem',
                      padding: '0.6rem 1.2rem',
                      fontWeight: '600',
                      border: '2px solid rgba(255,255,255,0.3)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}
                  >
                    View Details
                  </Badge>
                </Card.Body>
              </Card>
            </Col>

            <Col sm={12} md={4}>
              <Card
                className='h-100 shadow-lg'
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundImage: 'url(https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=400&fit=crop)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '350px',
                  border: '3px solid #22c55e40',
                  borderRadius: '15px',
                  boxShadow: '0 4px 15px #22c55e30'
                }}
                onClick={() => navigate('/profile/edit')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 30px #22c55e80, 0 0 25px #22c55e60';
                  e.currentTarget.style.border = '3px solid #22c55e';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px #22c55e30';
                  e.currentTarget.style.border = '3px solid #22c55e40';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(0,0,0,0.75) 0%, #22c55e40 100%)',
                  zIndex: 1,
                  transition: 'all 0.3s ease'
                }} />

                <Card.Body className='text-center position-relative d-flex flex-column justify-content-center' style={{ zIndex: 2, padding: '2rem' }}>
                  <Card.Title style={{
                    color: '#ffffff',
                    fontWeight: '800',
                    fontSize: '1.5rem',
                    textShadow: '0 2px 8px rgba(0,0,0,0.7), 0 0 15px #22c55e80',
                    marginBottom: '1rem',
                    letterSpacing: '0.5px'
                  }}>
                    Update Profile
                  </Card.Title>
                  <Card.Text className='text-light' style={{
                    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                    fontSize: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    Edit your information
                  </Card.Text>
                  <Badge
                    pill
                    style={{
                      background: 'linear-gradient(135deg, #22c55e, #22c55eCC)',
                      fontSize: '0.95rem',
                      padding: '0.6rem 1.2rem',
                      fontWeight: '600',
                      border: '2px solid rgba(255,255,255,0.3)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}
                  >
                    Edit Details
                  </Badge>
                </Card.Body>
              </Card>
            </Col>

            <Col sm={12} md={4}>
              <Card
                className='h-100 shadow-lg'
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundImage: 'url(https://images.unsplash.com/photo-1557821552-17105176677c?w=600&h=400&fit=crop)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '350px',
                  border: '3px solid #a855f740',
                  borderRadius: '15px',
                  boxShadow: '0 4px 15px #a855f730'
                }}
                onClick={() => navigate('/orders')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 30px #a855f780, 0 0 25px #a855f760';
                  e.currentTarget.style.border = '3px solid #a855f7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px #a855f730';
                  e.currentTarget.style.border = '3px solid #a855f740';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(0,0,0,0.75) 0%, #a855f740 100%)',
                  zIndex: 1,
                  transition: 'all 0.3s ease'
                }} />

                <Card.Body className='text-center position-relative d-flex flex-column justify-content-center' style={{ zIndex: 2, padding: '2rem' }}>
                  <Card.Title style={{
                    color: '#ffffff',
                    fontWeight: '800',
                    fontSize: '1.5rem',
                    textShadow: '0 2px 8px rgba(0,0,0,0.7), 0 0 15px #a855f780',
                    marginBottom: '1rem',
                    letterSpacing: '0.5px'
                  }}>
                    Previous Orders
                  </Card.Title>
                  <Card.Text className='text-light' style={{
                    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                    fontSize: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    View your order history
                  </Card.Text>
                  <Badge
                    pill
                    style={{
                      background: 'linear-gradient(135deg, #a855f7, #a855f7CC)',
                      fontSize: '0.95rem',
                      padding: '0.6rem 1.2rem',
                      fontWeight: '600',
                      border: '2px solid rgba(255,255,255,0.3)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}
                  >
                    View Orders
                  </Badge>
                </Card.Body>
              </Card>
            </Col>
            
            <Col sm={12} md={4}  className='offset-md-4'>
              <Card
                className='h-100 shadow-lg'
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundImage: 'url(https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '350px',
                  border: '3px solid #ec489940',
                  borderRadius: '15px',
                  boxShadow: '0 4px 15px #ec489930'
                }}
                onClick={() => navigate('/wishlist')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 30px #ec489980, 0 0 25px #ec489960';
                  e.currentTarget.style.border = '3px solid #ec4899';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px #ec489930';
                  e.currentTarget.style.border = '3px solid #ec489940';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(0,0,0,0.75) 0%, #ec489940 100%)',
                  zIndex: 1,
                  transition: 'all 0.3s ease'
                }} />

                <Card.Body className='text-center position-relative d-flex flex-column justify-content-center' style={{ zIndex: 2, padding: '2rem' }}>
                  <Card.Title style={{
                    color: '#ffffff',
                    fontWeight: '800',
                    fontSize: '1.5rem',
                    textShadow: '0 2px 8px rgba(0,0,0,0.7), 0 0 15px #ec489980',
                    marginBottom: '1rem',
                    letterSpacing: '0.5px'
                  }}>
                    My Wishlist
                  </Card.Title>
                  <Card.Text className='text-light' style={{
                    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                    fontSize: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    View your saved items
                  </Card.Text>
                  <Badge
                    pill
                    style={{
                      background: 'linear-gradient(135deg, #ec4899, #ec4899CC)',
                      fontSize: '0.95rem',
                      padding: '0.6rem 1.2rem',
                      fontWeight: '600',
                      border: '2px solid rgba(255,255,255,0.3)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}
                  >
                    View Wishlist
                  </Badge>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

    </>
  );
};

export default ProfilePage;
