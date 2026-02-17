import React from 'react';
import { Container, Row, Col, Button, Card, Badge, Image, Modal, Form } from 'react-bootstrap';
import { FaCheck, FaXmark, FaArrowLeft } from 'react-icons/fa6';
import { useGetMyOrdersQuery, useCancelOrderMutation, useReturnOrderMutation } from '../slices/ordersApiSlice';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { addCurrency } from '../utils/addCurrency';
import { toast } from 'react-toastify';

const PreviousOrdersPage = () => {
  const { data: allOrders, isLoading, error } = useGetMyOrdersQuery();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [returnOrder, { isLoading: isReturning }] = useReturnOrderMutation();
  const navigate = useNavigate();

  const orders = allOrders ? allOrders.filter(order => order._id !== '69906ed8d8714a02130fb77d') : [];

  const [cancellingOrderId, setCancellingOrderId] = React.useState(null);
  const [cancelReason, setCancelReason] = React.useState('');
  const [showCancelModal, setShowCancelModal] = React.useState(false);

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setCancellingOrderId(null);
    setCancelReason('');
  };

  const handleShowCancelModal = (id) => {
    setCancellingOrderId(id);
    setShowCancelModal(true);
  };

  const confirmCancelHandler = async () => {
    if (!cancellingOrderId) return;
    try {
      await cancelOrder({ orderId: cancellingOrderId, cancelReason }).unwrap();
      toast.success('Order cancelled successfully');
      handleCloseCancelModal();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const returnHandler = async (id) => {
    if (window.confirm('Are you sure you want to request a return for this order?')) {
      try {
        await returnOrder(id).unwrap();
        toast.success('Return requested successfully');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Meta title='LunarMart | My Orders' />
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
          onClick={() => navigate('/profile')}
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
      </div>
      <Container className='py-4'>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : orders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 40px',
            borderRadius: '15px',
            border: '2px solid rgba(52, 211, 153, 0.3)',
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            maxWidth: '640px',
            margin: '40px auto'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px', color: '#34d399' }}>📦</div>

            <p style={{ fontSize: '1.3rem', marginBottom: '30px', color: '#e2e8f0', fontWeight: '600' }}>You haven't placed any orders yet</p>
            <p style={{ fontSize: '1rem', marginBottom: '30px', color: '#94a3b8' }}>Start shopping and explore our amazing collection</p>
            <Button
              onClick={() => navigate('/')}
              style={{
                background: 'linear-gradient(135deg, #34d399, #22d3ee)',
                border: 'none',
                fontWeight: '700',
                padding: '12px 40px',
                fontSize: '1rem',
                borderRadius: '8px'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            <Row className="mb-4 g-3">
              <Col sm={6} md={3}>
                <div style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{ fontSize: '2rem' }}>📦</div>
                  <div>
                    <h4 style={{ color: '#fff', fontWeight: 'bold', margin: 0 }}>{orders.length}</h4>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Total Orders</p>
                  </div>
                </div>
              </Col>
              <Col sm={6} md={3}>
                <div style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{ fontSize: '2rem' }}>✅</div>
                  <div>
                    <h4 style={{ color: '#10b981', fontWeight: 'bold', margin: 0 }}>
                      {orders.filter(o => o.isDelivered).length}
                    </h4>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Delivered</p>
                  </div>
                </div>
              </Col>
              <Col sm={6} md={3}>
                <div style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{ fontSize: '2rem' }}>❌</div>
                  <div>
                    <h4 style={{ color: '#ef4444', fontWeight: 'bold', margin: 0 }}>
                      {orders.filter(o => o.orderItems.every(item => item.status === 'cancelled')).length}
                    </h4>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Cancelled</p>
                  </div>
                </div>
              </Col>
              <Col sm={6} md={3}>
                <div style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{ fontSize: '2rem' }}>↩️</div>
                  <div>
                    <h4 style={{ color: '#f59e0b', fontWeight: 'bold', margin: 0 }}>
                      {orders.filter(o => o.orderItems.some(item => ['returned', 'return_accepted'].includes(item.status))).length}
                    </h4>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Returned</p>
                  </div>
                </div>
              </Col>
            </Row >
            <Row className='g-4' style={{ marginTop: '0px' }}>
              {orders.map(order => (
                <Col key={order._id} sm={12} md={6} lg={4}>
                  <Card
                    className='h-100 shadow-lg position-relative'
                    style={{ transition: 'transform 0.3s', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '16px', overflow: 'hidden' }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-8px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                  >


                    <div
                      style={{
                        height: '180px',
                        background: 'rgba(15, 23, 42, 0.5)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
                        overflow: 'hidden',
                        position: 'relative'
                      }}
                    >
                      {order.orderItems && order.orderItems.length > 0 ? (
                        <Image
                          src={order.orderItems[0].image}
                          alt={order.orderItems[0].name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease'
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&h=600&fit=crop';
                          }}
                        />
                      ) : (
                        <div style={{ fontSize: '3rem' }}>📦</div>
                      )}
                    </div>

                    <Card.Body>
                      <div className='mb-3'>
                        <Card.Text className='small' style={{ color: '#94a3b8' }}>
                          Ordered on: {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Card.Text>
                      </div>

                      <div className='d-flex justify-content-between align-items-center mb-2'>
                        <div>
                          <Card.Text className='small mb-1' style={{ color: '#94a3b8' }}>Total Amount</Card.Text>
                          <Card.Subtitle className='text-info fw-bold' style={{ fontSize: '1.2rem' }}>
                            {addCurrency(order.totalPrice)}
                          </Card.Subtitle>
                        </div>
                        <div className='text-end'>
                          <Card.Text className='small mb-1' style={{ color: '#94a3b8' }}>Payment</Card.Text>
                          <div>
                            {order.isPaid ? (
                              <Badge bg='success' style={{ fontSize: '0.75rem' }}>
                                <FaCheck /> Paid
                              </Badge>
                            ) : (
                              <Badge bg='danger' style={{ fontSize: '0.75rem' }}>
                                <FaXmark /> Unpaid
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                    <div className='d-flex flex-wrap gap-2 p-3 pt-0'>
                      <Button
                        variant='success'
                        onClick={() => navigate(`/order/${order._id}`)}
                        style={{ fontWeight: '700', flex: 1, minWidth: '100px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}
                      >
                        View Details
                      </Button>

                      {!order.isDelivered && (
                        order.orderItems.some(item => ['pending', 'shipped'].includes(item.status)) ? (
                          <Button
                            variant='danger'
                            onClick={() => handleShowCancelModal(order._id)}
                            disabled={isCancelling}
                            style={{ fontWeight: '700', flex: 1, minWidth: '100px' }}
                          >
                            Cancel
                          </Button>
                        ) : null
                      )}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container >

      <Modal show={showCancelModal} onHide={handleCloseCancelModal} centered className="dark-modal">
        <Modal.Header closeButton style={{ backgroundColor: '#1e293b', borderBottom: '1px solid #334155', color: '#f8fafc' }}>
          <Modal.Title>Cancel Order</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#0f172a', color: '#cbd5e1' }}>
          <Form>
            <Form.Group className="mb-3" controlId="cancelReason">
              <Form.Label>Reason for cancellation (Optional)</Form.Label>
              <style>
                {`
                  .custom-placeholder::placeholder {
                    color: #94a3b8 !important;
                    opacity: 1;
                  }
                `}
              </style>
              <Form.Control
                as="textarea"
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please share why you want to cancel..."
                className="custom-placeholder"
                style={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc' }}
              />
            </Form.Group>
            <p className="small" style={{ color: '#94a3b8' }}>
              Note: Cancellation cannot be undone. Refunds (if applicable) will be processed within 5-7 business days.
            </p>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#1e293b', borderTop: '1px solid #334155' }}>
          <Button variant="secondary" onClick={handleCloseCancelModal}>
            Close
          </Button>
          <Button variant="danger" onClick={confirmCancelHandler} disabled={isCancelling}>
            {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PreviousOrdersPage;
