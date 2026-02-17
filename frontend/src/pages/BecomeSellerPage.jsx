import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaStore, FaChartLine, FaShieldAlt, FaHeadset, FaRocket, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import Meta from '../components/Meta';

const BecomeSellerPage = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <FaChartLine size={32} />,
      title: 'Grow Your Sales',
      description: 'Reach thousands of customers and grow your decoration business exponentially.'
    },
    {
      icon: <FaShieldAlt size={32} />,
      title: 'Secure Platform',
      description: 'Our platform provides secure transactions and buyer protection for both parties.'
    },
    {
      icon: <FaHeadset size={32} />,
      title: '24/7 Support',
      description: 'Dedicated seller support team ready to help you anytime.'
    },
    {
      icon: <FaRocket size={32} />,
      title: 'Easy Setup',
      description: 'Get started in minutes with our simple seller registration process.'
    }
  ];

  return (
    <>
      <Meta title='Be a Seller' />
      <Container className='py-5'>
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
        <Row className='mb-5'>
          <Col lg={8} className='mx-auto text-center'>
            <div className='mb-4'>
              <FaStore size={56} style={{ color: '#34d399', marginBottom: '20px' }} />
            </div>
            <h1 style={{ 
              background: 'linear-gradient(135deg, #34d399, #22d3ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '2.5rem',
              fontWeight: '800'
            }}>
              Start Selling on LunarMart
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#e2e8f0' }}>
              Join thousands of successful sellers and grow your decoration business with us. 
              Reach more customers, increase sales, and build your brand.
            </p>
          </Col>
        </Row>

        <Row className='mb-5'>
          <h2 className='mb-4 text-center' style={{ 
            color: '#34d399', 
            fontWeight: '700', 
            fontSize: '2rem' 
          }}>
            Why Sell With Us?
          </h2>
          {benefits.map((benefit, idx) => (
            <Col md={6} lg={3} key={idx} className='mb-4'>
              <Card className='h-100 shadow-lg' style={{ 
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                transition: 'transform 0.3s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-8px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
                <Card.Body className='text-center'>
                  <div style={{ color: '#34d399', marginBottom: '15px' }}>
                    {benefit.icon}
                  </div>
                  <Card.Title style={{ color: '#e2e8f0', fontWeight: '700' }}>
                    {benefit.title}
                  </Card.Title>
                  <Card.Text style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
                    {benefit.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className='mb-5'>
          <Col lg={8} className='mx-auto'>
            <Card style={{ 
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(52, 211, 153, 0.3)'
            }}>
              <Card.Body>
                <h3 className='mb-4' style={{ color: '#22d3ee' }}>
                  Seller Requirements
                </h3>
                <ul style={{ color: '#cbd5e1' }}>
                  <li className='mb-3'>
                    <FaCheckCircle style={{ color: '#34d399', marginRight: '10px' }} />
                    Must be 18 years or older
                  </li>
                  <li className='mb-3'>
                    <FaCheckCircle style={{ color: '#34d399', marginRight: '10px' }} />
                    Valid business documentation
                  </li>
                  <li className='mb-3'>
                    <FaCheckCircle style={{ color: '#34d399', marginRight: '10px' }} />
                    Product quality assurance
                  </li>
                  <li className='mb-3'>
                    <FaCheckCircle style={{ color: '#34d399', marginRight: '10px' }} />
                    Customer service commitment
                  </li>
                  <li>
                    <FaCheckCircle style={{ color: '#34d399', marginRight: '10px' }} />
                    Timely order fulfillment
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className='mb-5'>
          <Col lg={8} className='mx-auto'>
            <Card style={{ 
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(52, 211, 153, 0.3)'
            }}>
              <Card.Body>
                <h3 className='mb-4 text-center' style={{ color: '#e2e8f0' }}>
                  How to Join as a Seller
                </h3>
                <ol style={{ color: '#cbd5e1', lineHeight: '1.9' }}>
                  <li>
                    <FaCheckCircle style={{ color: '#34d399', marginRight: '10px' }} />
                    Login or create your LunarMart account
                  </li>
                  <li>
                    <FaCheckCircle style={{ color: '#34d399', marginRight: '10px' }} />
                    Open Become Seller → click "Become a Seller"
                  </li>
                  <li>
                    <FaCheckCircle style={{ color: '#34d399', marginRight: '10px' }} />
                    Fill the seller application form with accurate details
                  </li>
                  <li>
                    <FaCheckCircle style={{ color: '#34d399', marginRight: '10px' }} />
                    Upload required documents (business ID, address, product info)
                  </li>
                  <li>
                    <FaCheckCircle style={{ color: '#34d399', marginRight: '10px' }} />
                    Submit your application and await verification
                  </li>
                  <li>
                    <FaCheckCircle style={{ color: '#34d399', marginRight: '10px' }} />
                    After approval, list products and start selling
                  </li>
                </ol>
                <div className='text-center mt-3'>
                  <Button
                    size='lg'
                    onClick={() => navigate('/become-seller/apply')}
                    style={{
                      background: 'linear-gradient(135deg, #34d399, #22d3ee)',
                      border: 'none',
                      fontWeight: '700',
                      padding: '10px 30px'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    Apply Now
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

export default BecomeSellerPage;
