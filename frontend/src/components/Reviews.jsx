import Message from './Message';
import { ListGroup, Card, Image, Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Rating from './Rating';
import { useSelector } from 'react-redux';
import { useDeleteProductReviewMutation } from '../slices/productsApiSlice';
import { toast } from 'react-toastify';

const Reviews = ({ product }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [deleteProductReview, { isLoading: isDeleting }] = useDeleteProductReviewMutation();

  const deleteHandler = async (reviewId) => {
    try {
      const res = await deleteProductReview({ productId: product._id, reviewId });
      if (res.error) {
        toast.error(res.error?.data?.message || 'Failed to delete review');
      } else {
        toast.success('Review deleted successfully');
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="reviews-component">
      {product.reviews.length === 0 && (
        <Message variant="info">No reviews yet. Be the first to share your thoughts!</Message>
      )}

      <ListGroup variant='flush' className="bg-transparent">
        {product.reviews.map((review, index) => (
          <ListGroup.Item
            key={review._id || index}
            className="bg-transparent border-0 px-0 mb-4"
          >
            <Card className="review-card border-0 shadow-sm" style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '15px'
            }}>
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <strong className="text-light fs-5 d-block">{review.name}</strong>
                    <span className="text-secondary small">
                      {new Date(review.createdAt || review.date).toDateString()}
                    </span>
                  </div>

                  {userInfo && (userInfo._id === review.user || userInfo.role === 'admin') && (
                    <Button
                      variant="link"
                      className="text-danger p-0 delete-review-btn"
                      onClick={() => deleteHandler(review._id)}
                      disabled={isDeleting}
                    >
                      <FaTrash />
                    </Button>
                  )}
                </div>

                <div className="mb-3">
                  <Rating value={review.rating} color="#fbbf24" />
                </div>

                {review.image && (
                  <div className="review-image-wrapper mb-3" style={{ maxWidth: '200px' }}>
                    <Image
                      src={review.image}
                      alt="Review attachment"
                      fluid
                      rounded
                      style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                  </div>
                )}

                <p className="text-secondary mb-0" style={{ lineHeight: '1.6' }}>{review.comment}</p>
              </Card.Body>
            </Card>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <style>{`
        .review-card {
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .review-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.05) !important;
        }
        .delete-review-btn {
          opacity: 0.6;
          transition: opacity 0.2s;
        }
        .delete-review-btn:hover {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default Reviews;
