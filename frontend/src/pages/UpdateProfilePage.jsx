import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Meta from '../components/Meta';
import ProfileForm from '../components/ProfileForm';

const UpdateProfilePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Meta title='LunarMart | Update Profile' />
      <Container className='py-4 mt-5'>
        <Row className='justify-content-center'>
          <Col md={8} lg={6}>
            <Button 
              variant='link'
              className='mb-3'
              onClick={() => navigate('/profile')}
              style={{
                color: '#34d399',
                border: 'none',
                padding: '8px 12px',
                fontSize: '1.3rem',
                transition: 'all 0.3s',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(-5px)';
                e.currentTarget.style.color = '#10b981';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.color = '#34d399';
              }}
              title='Back to Profile'
            >
              <FaArrowLeft />
            </Button>
            <Card className='shadow-sm'>
              <Card.Body>
                <h2 className='mb-4'>Update Profile</h2>
                <ProfileForm />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UpdateProfilePage;
