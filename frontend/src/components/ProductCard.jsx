import { Card, Button } from 'react-bootstrap';
import { FaHeart } from 'react-icons/fa';
import { addToCart } from '../slices/cartSlice';

const ProductCard = ({ item, handleToggleWishlist, wishlistItems, navigate, dispatch, cartItems }) => {
    return (
        <Card className='h-100 shadow-lg position-relative' style={{
            transition: 'transform 0.3s',
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '16px'
        }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-8px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
            <Button
                variant='light'
                size='sm'
                style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    borderRadius: '50%',
                    padding: '8px',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    zIndex: 2
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    handleToggleWishlist(item);
                }}
                disabled={false}
                title={'Add to wishlist'}
            >
                <FaHeart color={wishlistItems.some(w => w._id === item._id) ? '#e11d48' : '#94a3b8'} />
            </Button>
            <Card.Img
                variant='top'
                src={item.image}
                style={{ height: '220px', objectFit: 'cover', borderRadius: '16px 16px 0 0' }}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&h=600&fit=crop';
                }}
            />
            <Card.Body>
                <Card.Title style={{ color: '#fff', fontWeight: '700' }}>{item.name}</Card.Title>
                <Card.Text className='small' style={{ color: '#cbd5e1' }}>
                    {item.description?.length > 100 ? item.description.substring(0, 100) + '...' : item.description}
                </Card.Text>
                <div className='d-flex justify-content-between align-items-center mt-auto'>
                    <Card.Subtitle className='text-info fw-bold' style={{ fontSize: '1.2rem' }}>₹{item.price}</Card.Subtitle>
                    <span className='text-warning' style={{ fontSize: '0.9rem' }}>⭐ {item.rating || 0} ({item.numReviews || 0})</span>
                </div>
            </Card.Body>
            <div className='d-flex gap-2 p-3 pt-0'>
                <Button
                    variant='outline-info'
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${item._id}`);
                    }}
                    style={{ fontWeight: '700', flex: 1, borderRadius: '8px' }}
                >
                    View
                </Button>
                <Button
                    variant='success'
                    onClick={(e) => {
                        e.stopPropagation();
                        const isInCart = cartItems.some(cartItem => cartItem._id === item._id);
                        if (isInCart) {
                            navigate('/cart');
                        } else {
                            dispatch(addToCart({ ...item, qty: 1 }));
                        }
                    }}
                    style={{
                        fontWeight: '700',
                        flex: 2,
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        border: 'none'
                    }}
                >
                    {cartItems.some(cartItem => cartItem._id === item._id) ? 'In Cart' : 'Add to Cart'}
                </Button>
            </div>
        </Card>
    );
};

export default ProductCard;
