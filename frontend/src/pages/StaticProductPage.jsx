import React, { useState } from 'react';
import { Row, Col, ListGroup, Button, Image, Form, Badge } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { toggleWishlist } from '../slices/wishlistSlice';
import { toast } from 'react-toastify';
import { FaStar, FaStarHalfAlt, FaRegStar, FaArrowLeft, FaHeart } from 'react-icons/fa';
import Meta from '../components/Meta';

const staticProducts = {};

const StaticProductPage = () => {
  const { id } = useParams();
  const product = staticProducts[id];
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.auth);
  const { wishlistItems } = useSelector(state => state.wishlist);

  if (!product) {
    return (
      <div className='text-center py-5'>
        <h2>Product not found</h2>
        <Link to='/' className='btn btn-primary mt-3'>Go Back Home</Link>
      </div>
    );
  }

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, _id: product.id, qty, countInStock: product.countInStock }));
    toast.success('Product added to cart!');
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlist({ ...product, _id: product.id }));
    toast.success(wishlistItems.some(w => w._id === product.id) ? 'Removed from wishlist!' : 'Added to wishlist!');
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} color='#ffc107' />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalfAlt key={i} color='#ffc107' />);
      } else {
        stars.push(<FaRegStar key={i} color='#ffc107' />);
      }
    }
    return stars;
  };

  return (
    <>
      <Meta title={product.name} />
      <div
        onClick={() => navigate('/')}
        style={{
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#34d399',
          fontSize: '1.5rem',
          margin: '20px 0',
          transition: 'all 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
      >
        <FaArrowLeft />
      </div>
      <Row>
        <Col md={6}>
          <Image
            src={product.images?.[selectedImage] || product.image}
            alt={product.name}
            fluid
            style={{ borderRadius: '10px', marginBottom: '20px' }}
          />
          {product.images && product.images.length > 1 && (
            <Row className='g-2'>
              {product.images.map((img, idx) => (
                <Col key={idx} xs={4}>
                  <Image
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    fluid
                    style={{
                      cursor: 'pointer',
                      borderRadius: '8px',
                      border: selectedImage === idx ? '3px solid #34d399' : '1px solid #ddd',
                      opacity: selectedImage === idx ? 1 : 0.7
                    }}
                    onClick={() => setSelectedImage(idx)}
                  />
                </Col>
              ))}
            </Row>
          )}
        </Col>
        <Col md={6}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <div className='d-flex align-items-center gap-2'>
                <div>{renderStars(product.rating)}</div>
              </div>
            </ListGroup.Item>
            <ListGroup.Item>
              <h4 className='text-success'>₹{product.price}</h4>
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>About this item:</strong>
              <p className='mt-2'>{product.description}</p>
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Available Colors:</strong>
              <div className='d-flex gap-2 mt-2'>
                {product.colors.map((color) => (
                  <Badge
                    key={color}
                    pill
                    bg={selectedColor === color ? 'success' : 'secondary'}
                    style={{ cursor: 'pointer', fontSize: '0.9rem', padding: '8px 12px' }}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </Badge>
                ))}
              </div>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col xs={6}>
                  <strong>Status:</strong> {product.countInStock > 0 ? <span className='text-success'>In Stock ({product.countInStock})</span> : <span className='text-danger'>Out Of Stock</span>}
                </Col>
                {product.countInStock > 0 && (
                  <Col xs={6}>
                    <strong>Qty:</strong>
                    <Form.Control
                      as='select'
                      value={qty}
                      onChange={e => setQty(Number(e.target.value))}
                      style={{ marginTop: '5px' }}
                    >
                      {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                )}
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                className='w-100'
                variant='success'
                type='button'
                disabled={product.countInStock === 0}
                onClick={addToCartHandler}
                style={{ fontWeight: '700', padding: '12px' }}
              >
                Add To Cart
              </Button>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                className='w-100'
                variant='outline-danger'
                type='button'
                onClick={handleToggleWishlist}
                style={{ fontWeight: '700', padding: '12px' }}
              >
                <FaHeart /> {wishlistItems.some(w => w._id === product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>

      {/* Customer Reviews */}
      <Row className='mt-5'>
        <Col md={12}>
          <h4 className='mb-4'>Customer Reviews</h4>
          {product.reviews && product.reviews.length > 0 ? (
            <ListGroup variant='flush'>
              {product.reviews.map((review, idx) => (
                <ListGroup.Item key={idx}>
                  <Row>
                    <Col md={8}>
                      <strong>{review.name}</strong>
                      <div className='my-2'>{renderStars(review.rating)}</div>
                      <p>{review.comment}</p>
                    </Col>
                    <Col md={4} className='text-md-end'>
                      <small className='text-muted'>{new Date(review.date).toLocaleDateString()}</small>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p className='text-muted'>No reviews yet. Be the first to review this product!</p>
          )}
        </Col>
      </Row>
    </>
  );
};

export default StaticProductPage;
