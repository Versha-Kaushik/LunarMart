import { Row, Col, Card, Button, Image } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaShoppingBag, FaCheckCircle, FaArrowLeft, FaTimesCircle, FaMapMarkerAlt } from 'react-icons/fa';
import { useGetMyOrdersQuery, useGetSellerOrdersQuery } from '../slices/ordersApiSlice';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Meta from '../components/Meta';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ViewProfilePage = () => {
  const { userInfo } = useSelector(state => state.auth);
  const { data: orders, isLoading: isLoadingOrders, error: errorOrders } = useGetMyOrdersQuery();
  const { data: sellerOrders, isLoading: isLoadingSellerOrders, error: errorSellerOrders } = useGetSellerOrdersQuery(undefined, {
    skip: !userInfo?.isSeller
  });
  const { data: sellerProductsData, isLoading: isLoadingProducts, error: errorProducts } = useGetProductsQuery({ userId: userInfo?._id }, {
    skip: !userInfo?.isSeller
  });
  const navigate = useNavigate();

  const deliveredOrders = orders?.filter(order => order.isDelivered).length || 0;
  const cancelledOrders = orders?.filter(order => order.orderItems.every(item => item.status === 'cancelled')).length || 0;
  const totalOrders = orders?.length || 0;
  const totalSellerProducts = sellerProductsData?.products?.length || 0;
  const totalSellerOrders = sellerOrders?.length || 0;
  const pendingSellerOrders = sellerOrders?.filter(o => o.orderItems.some(i => i.status === 'Processing' || i.status === 'Pending')).length || 0;

  const latestAddress = userInfo?.address ? {
    address: userInfo.address,
    city: userInfo.city,
    postalCode: userInfo.postalCode,
    country: userInfo.country
  } : (orders && orders.length > 0 ? orders[0].shippingAddress : null);

  const isLoading = isLoadingOrders || isLoadingSellerOrders || isLoadingProducts;
  const error = errorOrders || errorSellerOrders || errorProducts;

  return (
    <>
      <Meta title='LunarMart | My Profile' />
      <Row className='justify-content-center mt-5'>
        <Col md={8}>

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

          <h2 className='mb-4'>My Profile</h2>
          {userInfo && (
            <>
              <Card className='shadow-sm mb-4'>
                <Card.Body>
                  <h4 className='mb-4' style={{
                    background: 'linear-gradient(135deg, #34d399, #22d3ee)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: '700'
                  }}>
                    Profile Information
                  </h4>

                  {userInfo?.profileImage && (
                    <div className='text-center mb-4'>
                      <Image
                        src={userInfo.profileImage}
                        alt="Profile Picture"
                        style={{
                          width: '120px',
                          height: '120px',
                          objectFit: 'cover',
                          borderRadius: '50%',
                          border: '3px solid #34d399',
                        }}
                      />
                    </div>
                  )}

                  <Row className='mb-3'>
                    <Col xs={12} className='d-flex align-items-center mb-3'>
                      <div style={{
                        backgroundColor: 'rgba(52, 211, 153, 0.1)',
                        borderRadius: '50%',
                        padding: '15px',
                        marginRight: '15px'
                      }}>
                        <FaUser size={24} style={{ color: '#34d399' }} />
                      </div>
                      <div>
                        <small className='d-block' style={{ color: '#6c757d', fontWeight: '600' }}>Full Name</small>
                        <strong style={{ fontSize: '1.1rem' }}>{userInfo.name}</strong>
                      </div>
                    </Col>

                    <Col xs={12} className='d-flex align-items-center mb-3'>
                      <div style={{
                        backgroundColor: 'rgba(34, 211, 238, 0.1)',
                        borderRadius: '50%',
                        padding: '15px',
                        marginRight: '15px'
                      }}>
                        <FaEnvelope size={24} style={{ color: '#22d3ee' }} />
                      </div>
                      <div>
                        <small className='d-block' style={{ color: '#6c757d', fontWeight: '600' }}>Email Address</small>
                        <strong style={{ fontSize: '1.1rem' }}>{userInfo.email}</strong>
                      </div>
                    </Col>

                    <Col xs={12} className='d-flex align-items-center'>
                      <div style={{
                        backgroundColor: 'rgba(147, 51, 234, 0.1)',
                        borderRadius: '50%',
                        padding: '15px',
                        marginRight: '15px'
                      }}>
                        <FaPhone size={24} style={{ color: '#9333ea' }} />
                      </div>
                      <div>
                        <small className='d-block' style={{ color: '#6c757d', fontWeight: '600' }}>Phone Number</small>
                        <strong style={{ fontSize: '1.1rem' }}>{userInfo.mobile || 'Not provided'}</strong>
                      </div>
                    </Col>

                    <Col xs={12} className='d-flex align-items-center mb-3'>
                      <div style={{
                        backgroundColor: 'rgba(34, 211, 238, 0.1)',
                        borderRadius: '50%',
                        padding: '15px',
                        marginRight: '15px'
                      }}>
                        <FaUser size={24} style={{ color: '#22d3ee' }} />
                      </div>
                      <div>
                        <small className='d-block' style={{ color: '#6c757d', fontWeight: '600' }}>Seller</small>
                        <strong style={{ fontSize: '1.1rem' }}>{userInfo.isSeller ? 'Yes' : 'No'}</strong>
                      </div>
                    </Col>

                    {latestAddress && (
                      <Col xs={12} className='d-flex align-items-start mb-3'>
                        <div style={{
                          backgroundColor: 'rgba(236, 72, 153, 0.1)',
                          borderRadius: '50%',
                          padding: '15px',
                          marginRight: '15px',
                          marginTop: '5px'
                        }}>
                          <FaMapMarkerAlt size={24} style={{ color: '#ec4899' }} />
                        </div>
                        <div>
                          <small className='d-block' style={{ color: '#6c757d', fontWeight: '600' }}>Address</small>
                          <strong style={{ fontSize: '1.1rem' }}>
                            {latestAddress.address}, {latestAddress.city}, {latestAddress.postalCode}, {latestAddress.country}
                          </strong>
                        </div>
                      </Col>
                    )}
                  </Row>
                </Card.Body>
              </Card>

              <Card className='shadow-sm'>
                <Card.Body>
                  <h4 className='mb-4' style={{
                    background: 'linear-gradient(135deg, #34d399, #22d3ee)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: '700'
                  }}>
                    {'Order Statistics'}
                  </h4>
                  {isLoading ? (
                    <Loader />
                  ) : error ? (
                    <Message variant='danger'>
                      {error?.data?.message || error.error}
                    </Message>
                  ) : ( totalOrders === 0 ? (
                    <div className='text-center py-5'>
                      <div style={{ fontSize: '80px', marginBottom: '20px' }}>😢</div>
                      <p style={{ fontSize: '1.1rem', color: '#94a3b8' }}>No orders yet</p>
                    </div>
                  ) : (
                    <Row>
                      <Col md={4} className='mb-3 mb-md-0'>
                        <Card style={{
                          background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.1), rgba(34, 211, 238, 0.1))',
                          border: '1px solid rgba(52, 211, 153, 0.3)'
                        }}>
                          <Card.Body className='text-center'>
                            <FaShoppingBag size={30} style={{ color: '#34d399', marginBottom: '10px' }} />
                            <h3 style={{ color: '#34d399', fontWeight: '700' }}>{totalOrders}</h3>
                            <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Total Orders</p>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={4} className='mb-3 mb-md-0'>
                        <Card style={{
                          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
                          border: '1px solid rgba(16, 185, 129, 0.3)'
                        }}>
                          <Card.Body className='text-center'>
                            <FaCheckCircle size={30} style={{ color: '#10b981', marginBottom: '10px' }} />
                            <h3 style={{ color: '#10b981', fontWeight: '700' }}>{deliveredOrders}</h3>
                            <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Delivered</p>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={4}>
                        <Card style={{
                          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(185, 28, 28, 0.1))',
                          border: '1px solid rgba(239, 68, 68, 0.3)'
                        }}>
                          <Card.Body className='text-center'>
                            <FaTimesCircle size={30} style={{ color: '#ef4444', marginBottom: '10px' }} />
                            <h3 style={{ color: '#ef4444', fontWeight: '700' }}>{cancelledOrders}</h3>
                            <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Cancelled</p>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  ))}
                </Card.Body>
              </Card>
            </>
          )}
        </Col>
      </Row >
    </>
  );
};

export default ViewProfilePage;
