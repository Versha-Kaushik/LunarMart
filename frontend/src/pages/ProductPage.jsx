import React, { useState, useRef } from 'react';
import {
  Row,
  Col,
  Button,
  Image,
  Card,
  Form,
  Badge,
  Modal
} from 'react-bootstrap';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetProductDetailsQuery,
  useCreateProductReviewMutation
} from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';
import { toggleWishlist } from '../slices/wishlistSlice';
import { toast } from 'react-toastify';
import { FaHeart, FaArrowLeft, FaShoppingCart, FaCheckCircle, FaExclamationCircle, FaEdit, FaEye } from 'react-icons/fa';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { addCurrency } from '../utils/addCurrency';
import Reviews from '../components/Reviews';

const ProductPage = () => {
  const { id: productId } = useParams();
  const location = useLocation();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [reviewImage, setReviewImage] = useState('');
  const [showReviews, setShowReviews] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const reviewsRef = useRef(null);

  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('review') === 'true') {
      setShowReviewModal(true);
    }
  }, [location.search]);

  const { userInfo } = useSelector(state => state.auth);
  const { wishlistItems } = useSelector(state => state.wishlist);
  const { cartItems } = useSelector(state => state.cart);

  const isInCart = cartItems.find((x) => x._id === productId);

  const {
    data: product,
    isLoading,
    error
  } = useGetProductDetailsQuery(productId);

  const [createProductReview, { isLoading: isCreateProductReviewLoading }] =
    useCreateProductReviewMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const addToCartHandler = () => {
    if (isInCart) {
      navigate('/cart');
    } else {
      dispatch(addToCart({ ...product, qty, color: selectedColor }));
      toast.success('Product added to cart!');
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      dispatch(toggleWishlist(product));
      toast.success(wishlistItems.some(w => w._id === product._id) ? 'Removed from wishlist!' : 'Added to wishlist!');
    }
  };

  const handleToggleReviews = () => {
    setShowReviews(!showReviews);
    if (!showReviews) {
      setTimeout(() => {
        reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const submitHandler = async e => {
    e.preventDefault();
    if (!rating || Number(rating) === 0) {
      toast.error('Please select a rating');
      return;
    }
    try {
      const res = await createProductReview({
        productId,
        rating,
        comment,
        image: reviewImage
      });
      if (res.error) {
        toast.error(res.error?.data?.message);
      } else {
        toast.success(res.data.message);
        setRating('');
        setComment('');
        setReviewImage('');
        setShowReviewModal(false);
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error);
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
        <div className="product-page-container py-4">
          <Meta title={product.name} description={product.description} />

          <Button
            variant='link'
            className='text-success p-0 mb-4 text-decoration-none d-flex align-items-center gap-2'
            onClick={() => navigate(-1)}
            style={{ width: 'fit-content' }}
          >
            <FaArrowLeft style={{ fontSize: '1.5rem' }} />
          </Button>

          <Row className="g-5">
            <Col lg={7}>
              <div className="product-image-wrapper shadow-lg mb-4" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <Image
                  src={product.image}
                  alt={product.name}
                  fluid
                  style={{ width: '100%', objectFit: 'contain', height: 'auto', maxHeight: '400px', minHeight: '300px' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&h=800&fit=crop';
                  }}
                />
              </div>

              <div className="d-grid mb-5">
                <Button
                  variant={showReviews ? "danger" : "outline-info"}
                  size="lg"
                  onClick={handleToggleReviews}
                  className="py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                  style={{ borderRadius: '15px' }}
                >
                  <FaEye /> {showReviews ? "Hide Feedback" : "Show Feedback"}
                </Button>
              </div>

              {showReviews && (
                <div ref={reviewsRef} className="reviews-integrated-section transition-all">
                  <h2 className="text-light fw-bold mb-4">Community Feedback</h2>
                  <Reviews product={product} />
                </div>
              )}
            </Col>

            <Col lg={5}>
              <div className="product-info-integrated" style={{ position: 'sticky', top: '20px' }}>
                <Badge bg="success" className="mb-3 px-3 py-2" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                  {product.category?.toUpperCase()}
                </Badge>

                <h1 className="display-6 fw-bold mb-2" style={{ color: '#f8fafc' }}>{product.name}</h1>

                <div className="d-flex align-items-center gap-3 mb-4">
                  <Rating value={product.rating} text={`${product.numReviews} Reviews`} />
                  <span className="text-secondary">|</span>
                  <span className="text-info fw-bold">{product.brand}</span>
                </div>

                <Card className="purchase-card border-0 shadow-lg text-light mb-4" style={{
                  borderRadius: '20px',
                  background: 'rgba(30, 41, 59, 0.7)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid #475569'
                }}>
                  <Card.Body className="p-4">
                    <div className="product-description-in-card mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <h5 className="text-light fw-bold mb-2">Product Description</h5>
                      <p className="text-secondary mb-0" style={{ lineHeight: '1.6', fontSize: '1rem' }}>{product.description}</p>
                    </div>

                    {product.colors && product.colors.length > 0 && (
                      <div className="colors-section mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <h6 className="text-light fw-bold mb-3">Available Colors</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {product.colors.map((color, index) => (
                            <Button
                              key={index}
                              variant={selectedColor === color ? 'success' : 'outline-secondary'}
                              size="sm"
                              className="px-3"
                              style={{ borderRadius: '20px', transition: 'all 0.2s' }}
                              onClick={() => setSelectedColor(color)}
                            >
                              {color}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="price-in-card mb-4">
                      <h2 className="display-6 fw-bold text-success mb-0">{addCurrency(product.price)}</h2>
                    </div>

                    <Row className="align-items-center mb-3">
                      <Col>Status:</Col>
                      <Col className="text-end fw-bold">
                        {product.countInStock > 0 ? (
                          <span className="text-success d-flex align-items-center justify-content-end gap-2">
                            <FaCheckCircle /> In Stock
                          </span>
                        ) : (
                          <span className="text-danger d-flex align-items-center justify-content-end gap-2">
                            <FaExclamationCircle /> Out Of Stock
                          </span>
                        )}
                      </Col>
                    </Row>

                    <Row className="align-items-center mb-3">
                      <Col>Category:</Col>
                      <Col className="text-end fw-bold text-info">
                        {product.category}
                      </Col>
                    </Row>

                    {product.countInStock > 0 && (
                      <Row className="align-items-center mb-4">
                        <Col>Quantity:</Col>
                        <Col className="text-end">
                          <Form.Control
                            as="select"
                            value={qty}
                            className="bg-dark text-light border-secondary ms-auto"
                            style={{ width: '80px', borderRadius: '10px' }}
                            onChange={e => setQty(Number(e.target.value))}
                          >
                            {Array.from({ length: product.countInStock }, (_, i) => (
                              <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    )}

                    <div className="d-grid gap-3">
                      <Button
                        size="lg"
                        variant={isInCart ? "info" : "success"}
                        className="py-3 fw-bold d-flex align-items-center justify-content-center gap-2 transition-all"
                        style={{ borderRadius: '12px' }}
                        disabled={product.countInStock === 0}
                        onClick={addToCartHandler}
                      >
                        <FaShoppingCart /> {isInCart ? "View In Cart" : "Add To Cart"}
                      </Button>
                      <Button
                        size="lg"
                        variant="outline-danger"
                        className="py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                        style={{ borderRadius: '12px' }}
                        onClick={handleToggleWishlist}
                      >
                        <FaHeart /> {wishlistItems.some(w => w._id === product._id) ? 'Remove' : 'Add to Wishlist'}
                      </Button>
                      <Button
                        size="lg"
                        variant="outline-info"
                        className="py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                        style={{ borderRadius: '12px' }}
                        onClick={() => setShowReviewModal(true)}
                      >
                        <FaEdit /> Add Review
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>

          <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered className="review-modal">
            <Modal.Header closeButton className="bg-dark text-light border-secondary">
              <Modal.Title className="fw-bold">Write a Customer Review</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark text-light p-4">
              {userInfo ? (
                <Form onSubmit={submitHandler}>
                  <Form.Group className='mb-4' controlId='rating'>
                    <Form.Label className="text-secondary fw-bold small text-uppercase">Rating</Form.Label>
                    <Form.Control
                      as='select'
                      required
                      value={rating}
                      onChange={e => setRating(e.target.value)}
                      className="bg-dark text-light border-secondary"
                      style={{ borderRadius: '10px' }}
                    >
                      <option value=''>Select Rating...</option>
                      <option value='1'>1 - Poor</option>
                      <option value='2'>2 - Fair</option>
                      <option value='3'>3 - Good</option>
                      <option value='4'>4 - Very Good</option>
                      <option value='5'>5 - Excellent</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group className='mb-4' controlId='comment'>
                    <Form.Label className="text-secondary fw-bold small text-uppercase">Your Comment</Form.Label>
                    <Form.Control
                      as='textarea'
                      rows='4'
                      required
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="Share your experience..."
                      className="bg-dark text-light border-secondary"
                      style={{ borderRadius: '12px' }}
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group className='mb-4' controlId='reviewImage'>
                    <Form.Label className="text-secondary fw-bold small text-uppercase">Review Image URL (Optional)</Form.Label>
                    <Form.Control
                      type='text'
                      value={reviewImage}
                      onChange={e => setReviewImage(e.target.value)}
                      placeholder="Paste an image URL..."
                      className="bg-dark text-light border-secondary"
                      style={{ borderRadius: '12px' }}
                    ></Form.Control>
                  </Form.Group>
                  <Button
                    className='py-3 fw-bold transition-all w-100'
                    disabled={isCreateProductReviewLoading}
                    type='submit'
                    variant='success'
                    style={{ borderRadius: '12px' }}
                  >
                    {isCreateProductReviewLoading ? 'Submitting...' : 'Post Review'}
                  </Button>
                </Form>
              ) : (
                <div className="text-center py-3">
                  <Message variant="warning">
                    Please <Link to='/login' className="text-dark fw-bold">sign in</Link> to write a review
                  </Message>
                </div>
              )}
            </Modal.Body>
          </Modal>
        </div>
      )}

      <style>{`
        .transition-all {
          transition: all 0.3s ease;
        }
        .btn-success:hover, .btn-outline-info:hover, .btn-info:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(52, 211, 153, 0.4);
        }
        .product-image-wrapper:hover img {
          transform: scale(1.02);
          transition: transform 0.5s ease;
        }
        .reviews-integrated-section {
          animation: fadeIn 0.5s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .review-modal .modal-content {
          border-radius: 20px;
          border: 1px solid #334155;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default ProductPage;
