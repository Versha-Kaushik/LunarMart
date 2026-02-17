import React, { useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Row, Col, ListGroup, Button, Image, Card, Badge, Modal, Form } from 'react-bootstrap';
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useUpdateDeliverMutation,
  useCancelOrderMutation,
} from '../slices/ordersApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaIndianRupeeSign, FaArrowLeft, FaEye, FaPenToSquare } from 'react-icons/fa6';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { addCurrency } from '../utils/addCurrency';

const OrderDetailsPage = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: isPayOrderLoading }] = usePayOrderMutation();
  const [updateDeliver, { isLoading: isUpdateDeliverLoading }] =
    useUpdateDeliverMutation();
  const [cancelOrder, { isLoading: isCancelLoading }] = useCancelOrderMutation();

  const { userInfo } = useSelector(state => state.auth);

  const [cancelReason, setCancelReason] = React.useState('');
  const [showCancelModal, setShowCancelModal] = React.useState(false);

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setCancelReason('');
  };

  const handleShowCancelModal = () => {
    setShowCancelModal(true);
  };

  const deliveredHandler = async () => {
    try {
      await updateDeliver(orderId);
      toast.success('Order Delivered');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const returnHandler = () => {
    navigate(`/order/${orderId}/return`);
  };

  const confirmCancelHandler = async () => {
    try {
      await cancelOrder({ orderId, cancelReason }).unwrap();
      toast.success('Order cancelled successfully');
      handleCloseCancelModal();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta title={'Order Details'} />
          <div className='d-flex align-items-center mb-4'>
            <Button
              variant='link'
              className='p-0 me-3 text-success'
              onClick={() => navigate(-1)}
              style={{ fontSize: '1.5rem', textDecoration: 'none' }}
            >
              <FaArrowLeft />
            </Button>
            <h1 className='m-0 fw-bold' style={{ color: '#fff', fontSize: '1.8rem' }}>Order Details</h1>
            <div className='ms-auto d-flex align-items-center gap-3'>
              <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Status:</span>
              <Badge
                bg={
                  order.orderItems.every(item => item.status === 'cancelled') ? 'danger' :
                    order.orderItems.some(item => item.status === 'return_accepted') ? 'primary' :
                      order.orderItems.every(item => item.status === 'return_requested') ? 'info' :
                        order.isDelivered ? 'success' : 'warning'
                }
                style={{ fontSize: '0.9rem', padding: '0.6rem 1.2rem', borderRadius: '30px', textTransform: 'uppercase', letterSpacing: '1px' }}
              >
                {
                  order.orderItems.every(item => item.status === 'cancelled') ? 'Cancelled' :
                    order.orderItems.some(item => item.status === 'return_accepted') ? 'Return Accepted' :
                      order.orderItems.every(item => item.status === 'return_requested') ? 'Return Requested' :
                        order.isDelivered ? 'Delivered' : 'Processing'
                }
              </Badge>
            </div>
          </div>
          <Row className='g-4'>
            <Col md={7}>
              <ListGroup variant='flush' style={{ borderRadius: '15px', overflow: 'hidden', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
                <ListGroup.Item className='bg-dark text-light border-secondary p-4'>
                  <h2 className='text-success fw-bold mb-4'><i className='fas fa-shopping-basket me-2'></i>Order Items</h2>
                  <ListGroup variant='flush'>
                    {order?.orderItems?.map(item => (
                      <ListGroup.Item
                        key={item._id}
                        className='text-light border-secondary px-3 py-3 mb-3'
                        style={{
                          background: 'rgba(255, 255, 255, 0.06)',
                          borderRadius: '12px',
                          border: '1px solid rgba(148, 163, 184, 0.2)'
                        }}
                      >
                        <Row className='align-items-center'>
                          <Col md={3}>
                            <div className="product-image-wrapper shadow-lg" style={{
                              borderRadius: '16px',
                              overflow: 'hidden',
                              border: '1px solid rgba(148, 163, 184, 0.2)',
                              width: '100%',
                              aspectRatio: '1/1',
                              background: 'rgba(15, 23, 42, 0.5)'
                            }}>
                              <Image
                                src={item.image}
                                alt={item.name}
                                fluid
                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&h=600&fit=crop';
                                }}
                              />
                            </div>
                          </Col>
                          <Col md={6}>
                            <Link
                              to={`/product/${item.product}`}
                              className='product-title text-light fw-bold'
                              style={{ textDecoration: 'none', fontSize: '1.1rem' }}
                            >
                              {item.name}
                            </Link>
                            <div className='mt-3 d-flex flex-wrap gap-2'>
                              <Button
                                size='sm'
                                variant='outline-info'
                                className='d-flex align-items-center gap-2 fw-bold px-3 py-2'
                                style={{ borderRadius: '8px', fontSize: '0.8rem', transition: 'all 0.3s' }}
                                onClick={() => navigate(`/product/${item.product}`)}
                              >
                                <FaEye /> View Product
                              </Button>
                              <Button
                                size='sm'
                                variant='outline-success'
                                className='d-flex align-items-center gap-2 fw-bold px-3 py-2'
                                style={{ borderRadius: '8px', fontSize: '0.8rem', transition: 'all 0.3s' }}
                                onClick={() => navigate(`/product/${item.product}?review=true`)}
                              >
                                <FaPenToSquare /> Give Review
                              </Button>
                            </div>
                          </Col>
                          <Col md={3} className='text-end'>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={5}>
              <Card className='shadow-lg border-0' style={{
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(52, 211, 153, 0.2)',
                borderRadius: '20px',
                overflow: 'hidden'
              }}>
                <ListGroup variant='flush'>
                  <ListGroup.Item className='bg-transparent text-light border-0 p-4'>
                    <h2 className='text-success fw-bold mb-4' style={{ fontSize: '1.4rem' }}>
                      <i className='fas fa-info-circle me-2'></i>Order Details
                    </h2>

                    {order.orderItems.some(item => item.status === 'return_requested') && order.returnRequestedAt && (
                      <Card className='mb-4' style={{
                        background: 'rgba(59, 130, 246, 0.15)',
                        border: '2px dashed #3b82f6',
                        borderRadius: '16px',
                        overflow: 'hidden'
                      }}>
                        <Card.Body className='p-3'>
                          <h5 className='mb-2' style={{ color: '#3b82f6', fontWeight: '800', fontSize: '1rem' }}>
                            <i className='fas fa-truck-pickup me-2'></i>RETURN REQUESTED
                          </h5>
                          <p className='mb-1 fw-bold' style={{ color: '#fff', fontSize: '1.1rem' }}>
                            Estimated Pickup: {new Date(new Date(order.returnRequestedAt).setDate(new Date(order.returnRequestedAt).getDate() + 7)).toLocaleDateString('en-IN', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className='mb-0 text-info font-italic' style={{ fontSize: '0.85rem' }}>
                            Our agent will arrive at your address on this date.
                          </p>
                        </Card.Body>
                      </Card>
                    )}

                    {order.orderItems.some(item => item.status === 'return_accepted') && order.pickupTime && (
                      <Card className='mb-4' style={{
                        background: 'rgba(59, 130, 246, 0.15)',
                        border: '2px dashed #3b82f6',
                        borderRadius: '16px',
                        overflow: 'hidden'
                      }}>
                        <Card.Body className='p-3'>
                          <h5 className='mb-2' style={{ color: '#3b82f6', fontWeight: '800', fontSize: '1rem' }}>
                            <i className='fas fa-truck-pickup me-2'></i>PICKUP OPTION
                          </h5>
                          <p className='mb-1 fw-bold' style={{ color: '#fff', fontSize: '1.1rem' }}>
                            Scheduled for: {new Date(order.pickupTime).toLocaleDateString('en-IN', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className='mb-0 text-info font-italic' style={{ fontSize: '0.85rem' }}>
                            Our agent will arrive at your address in 7 days.
                          </p>
                        </Card.Body>
                      </Card>
                    )}

                    <div className='mb-4'>
                      <p className='mb-1' style={{ color: '#34d399', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '700' }}>Customer</p>
                      <p className='mb-0' style={{ fontSize: '1.1rem' }}>{order?.user?.name}</p>
                    </div>

                    <div className='mb-4'>
                      <p className='mb-1' style={{ color: '#34d399', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '700' }}>Shipping Address</p>
                      <p className='mb-0' style={{ color: '#cbd5e1', lineHeight: '1.5' }}>
                        {order?.shippingAddress?.address}<br />
                        {order?.shippingAddress?.city}, {order?.shippingAddress?.postalCode}<br />
                        {order?.shippingAddress?.country}
                      </p>
                    </div>

                    <div className='mb-4'>
                      <p className='mb-1' style={{ color: '#34d399', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '700' }}>Order Status</p>
                      <Badge
                        bg={
                          order.orderItems.every(item => item.status === 'cancelled') ? 'danger' :
                            order.orderItems.some(item => item.status === 'return_accepted') ? 'primary' :
                              order.orderItems.every(item => item.status === 'return_requested') ? 'info' :
                                order.isDelivered ? 'success' : 'warning'
                        }
                        style={{ fontSize: '0.9rem', padding: '0.6rem 1.2rem', borderRadius: '30px', textTransform: 'uppercase', letterSpacing: '1px' }}
                      >
                        {
                          order.orderItems.every(item => item.status === 'cancelled') ? 'Cancelled' :
                            order.orderItems.some(item => item.status === 'return_accepted') ? 'Return Accepted' :
                              order.orderItems.every(item => item.status === 'return_requested') ? 'Return Requested' :
                                order.isDelivered ? 'Delivered' : 'Processing'
                        }
                      </Badge>
                    </div>

                    <div className='mb-4'>
                      <p className='mb-1' style={{ color: '#34d399', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '700' }}>Payment Method</p>
                      <p className='mb-2'>{order?.paymentMethod}</p>
                      {order?.isPaid && (
                        <Badge bg='success' className='py-2 px-3' style={{ borderRadius: '8px' }}>
                          Paid on {new Date(order?.paidAt).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>

                    <div className='border-top border-secondary pt-4 mt-2'>
                      <div className='d-flex justify-content-between mb-2' style={{ color: '#cbd5e1' }}>
                        <span>Items ({order?.orderItems?.reduce((acc, item) => acc + item.qty, 0)}):</span>
                        <span>{addCurrency(order?.itemsPrice)}</span>
                      </div>
                      <div className='d-flex justify-content-between mb-2' style={{ color: '#cbd5e1' }}>
                        <span>Shipping:</span>
                        <span>{addCurrency(order?.shippingPrice)}</span>
                      </div>
                      <div className='d-flex justify-content-between mb-3' style={{ color: '#cbd5e1' }}>
                        <span>GST:</span>
                        <span>{addCurrency(order?.taxPrice)}</span>
                      </div>
                      <div className='d-flex justify-content-between align-items-center mb-4 pt-3 border-top border-secondary'>
                        <span className='h4 mb-0 fw-bold' style={{ color: '#fff' }}>Total Cost:</span>
                        <span className='h3 mb-0 fw-bold text-success'>{addCurrency(order?.totalPrice)}</span>
                      </div>

                      <div className='d-grid gap-3'>
                        {!order?.isPaid && !userInfo.isAdmin && order?.paymentMethod === 'Razorpay' && (
                          <Button
                            disabled={isPayOrderLoading}
                            style={{
                              background: 'linear-gradient(135deg, #10b981, #059669)',
                              border: 'none',
                              fontWeight: '800',
                              padding: '14px',
                              fontSize: '1.1rem',
                              borderRadius: '12px',
                              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                            }}
                          >
                            {isPayOrderLoading ? 'Processing...' : 'Pay with Razorpay'}
                          </Button>
                        )}

                        {userInfo && userInfo.isAdmin && order?.isPaid && !order?.isDelivered && (
                          <Button
                            onClick={deliveredHandler}
                            disabled={isUpdateDeliverLoading}
                            style={{
                              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                              border: 'none',
                              fontWeight: '800',
                              padding: '14px',
                              fontSize: '1.1rem',
                              borderRadius: '12px'
                            }}
                          >
                            Mark As Delivered
                          </Button>
                        )}

                        {order.isDelivered &&
                          order.orderItems.some(item => item.status === 'delivered') &&
                          (new Date() - new Date(order.deliveredAt)) / (1000 * 60 * 60 * 24) <= 10 && (
                            <Button
                              variant='warning'
                              onClick={returnHandler}
                              style={{
                                fontWeight: '800',
                                padding: '14px',
                                fontSize: '1.1rem',
                                borderRadius: '12px',
                                color: '#000'
                              }}
                            >
                              Return Order
                            </Button>
                          )}

                        {!order.isDelivered && order.orderItems.some(item => ['pending', 'shipped'].includes(item.status)) && (
                          <Button
                            variant='danger'
                            onClick={handleShowCancelModal}
                            disabled={isCancelLoading}
                            style={{
                              fontWeight: '800',
                              padding: '14px',
                              fontSize: '1.1rem',
                              borderRadius: '12px'
                            }}
                          >
                            {isCancelLoading ? 'Processing...' : 'Cancel Order'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

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
              <Button variant="danger" onClick={confirmCancelHandler} disabled={isCancelLoading}>
                {isCancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};

export default OrderDetailsPage;
