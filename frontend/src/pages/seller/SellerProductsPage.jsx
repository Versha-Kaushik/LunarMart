import React, { useState } from 'react';
import { Card, Row, Col, Badge, Button, Form, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch, FaPlus, FaPalette, FaCube, FaLightbulb, FaGem, FaImage, FaLayerGroup } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Meta from '../../components/Meta';
import { toast } from 'react-toastify';
import {
    useGetProductsQuery,
    useDeleteProductMutation,
    useUpdateProductMutation
} from '../../slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getCroppedImg } from '../../utils/cropImage';

const SellerProductsPage = () => {
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editProductData, setEditProductData] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);
    const [currentColor, setCurrentColor] = useState('#9333ea');
    const [editImagePreview, setEditImagePreview] = useState('');
    const [editImageMode, setEditImageMode] = useState('upload');

    const [crop, setCrop] = useState({
        unit: '%',
        width: 50,
        height: 50,
        x: 25,
        y: 25
    });
    const [completedCrop, setCompletedCrop] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [imageToCrop, setImageToCrop] = useState(null);
    const [imageRef, setImageRef] = useState(null);

    const { data, isLoading, error, refetch } = useGetProductsQuery({
        userId: userInfo?._id
    });

    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

    const products = data?.products || [];

    const handleEditClick = (product) => {
        setEditProductData({
            ...product,
            colors: product.colors || [],
            image: ''
        });
        setEditImagePreview(product.image);
        setEditImageMode(product.image?.startsWith('http') ? 'link' : 'upload');
        setShowEditModal(true);
    };

    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (productToDelete) {
            try {
                await deleteProduct(productToDelete._id).unwrap();
                setShowDeleteModal(false);
                setProductToDelete(null);
                toast.error('Product deleted successfully');
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProduct({
                productId: editProductData._id,
                ...editProductData,
                price: parseFloat(editProductData.price),
                countInStock: parseInt(editProductData.countInStock),
                image: editProductData.image || editImagePreview,
                description: editProductData.description
            }).unwrap();

            setShowEditModal(false);
            toast.success('Product updated successfully');
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditProductData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result;
                setEditImagePreview(result);
                setEditProductData(prev => ({ ...prev, image: result }));
                setImageToCrop(result);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const addEditColor = () => {
        if (!editProductData.colors.includes(currentColor)) {
            setEditProductData(prev => ({
                ...prev,
                colors: [...prev.colors, currentColor]
            }));
        }
    };

    const removeEditColor = (colorToRemove) => {
        setEditProductData(prev => ({
            ...prev,
            colors: prev.colors.filter(c => c !== colorToRemove)
        }));
    };

    const handleCropSave = async () => {
        if (completedCrop?.width && completedCrop?.height && imageRef) {
            try {
                const scaleX = imageRef.naturalWidth / imageRef.width;
                const scaleY = imageRef.naturalHeight / imageRef.height;

                const pixelCrop = {
                    x: completedCrop.x * scaleX,
                    y: completedCrop.y * scaleY,
                    width: completedCrop.width * scaleX,
                    height: completedCrop.height * scaleY,
                };

                const croppedImage = await getCroppedImg(imageToCrop, pixelCrop);
                setEditImagePreview(croppedImage);
                setEditProductData(prev => ({ ...prev, image: croppedImage }));
                setShowCropper(false);
                toast.success('Image cropped successfully!');
            } catch (e) {
                console.error(e);
                toast.error('Failed to crop image');
            }
        }
    };

    const handleCropClick = () => {
        if (!editImagePreview) {
            toast.error('Please select an image first');
            return;
        }
        setImageToCrop(editImagePreview);
        setShowCropper(true);
    };

    const [categoryFilter, setCategoryFilter] = useState('');

    const filteredProducts = products.filter(p => {
        const matchesSearch = (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
            p.name !== 'Vanilla Bean Jar Candle';
        const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
        return matchesSearch && matchesCategory;
    });

    const categories = [
        {
            id: 'wall-art',
            name: 'Wall Art',
            icon: FaPalette,
            color: '#38bdf8',
            description: 'Beautiful wall decorations and artwork',
            image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 'vases',
            name: 'Vases',
            icon: FaCube,
            color: '#7c3aed',
            description: 'Elegant handcrafted ceramic and glass vases',
            image: 'https://media.istockphoto.com/id/2217238489/photo/minimal-bedroom-interior-decor-with-fresh-pink-peony-flowers-in-a-white-ceramic-vase-and.webp?a=1&b=1&s=612x612&w=0&k=20&c=rhZIAThLHtMMeeQN41hOJb-_7eLtYbOopCBTC8IAlKs='
        },
        {
            id: 'lighting',
            name: 'Lighting',
            icon: FaLightbulb,
            color: '#f59e0b',
            description: 'Ambient lighting solutions',
            image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 'mirrors',
            name: 'Mirrors',
            icon: FaGem,
            color: '#10b981',
            description: 'Decorative mirrors',
            image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 'wallpaper',
            name: 'Wallpaper',
            icon: FaImage,
            color: '#ec4899',
            description: 'Stunning wall patterns and textures',
            image: 'https://images.unsplash.com/photo-1770387795112-e2b476b15f71?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDR8Ym84alFLVGFFMFl8fGVufDB8fHx8fA%3D%3D'
        },
        {
            id: 'scented-candles',
            name: 'Scented Candles',
            icon: FaLayerGroup,
            color: '#f43f5e',
            description: 'Premium aromatic candles for home ambiance',
            image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80'
        },
    ];

    return (
        <>
            <Meta title="Seller Dashboard - Products" />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 style={{
                        color: '#e2e8f0',
                        fontWeight: '700',
                        marginBottom: '0.5rem',
                        marginTop: '1rem',
                        marginLeft: '1.5rem',
                        fontSize: '2rem'
                    }}>
                        Your Products
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0 0 0 1.5rem' }}>
                        Manage and track your decoration inventory
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/seller/add-product')}
                    style={{
                        background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                        border: 'none',
                        padding: '0.6rem 1.5rem',
                        marginTop: '1rem',
                        marginRight: '1.5rem',
                        fontWeight: '700',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 10px 20px -5px rgba(6, 182, 212, 0.4)',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 15px 25px -5px rgba(6, 182, 212, 0.5)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(6, 182, 212, 0.4)';
                    }}
                >
                    <FaPlus /> Add Product
                </Button>
            </div>

            < Card style={{
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '16px',
                marginBottom: '2rem',
                marginRight: '1.5rem',
                marginLeft: '1.5rem',
                padding: '1.25rem'
            }}>
                <Row className="align-items-center">
                    <Col md={5}>
                        <div className="position-relative">
                            <FaSearch className="position-absolute" style={{
                                top: '50%',
                                left: '1rem',
                                transform: 'translateY(-50%)',
                                color: '#64748b'
                            }} />
                            <Form.Control
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    background: 'rgba(15, 23, 42, 0.8)',
                                    border: '1px solid rgba(148, 163, 184, 0.3)',
                                    color: '#e2e8f0',
                                    padding: '0.75rem 0.75rem 0.75rem 2.8rem',
                                    borderRadius: '10px'
                                }}
                            />
                        </div>
                    </Col>
                    <Col md={4}>
                        <Form.Select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            style={{
                                background: 'rgba(15, 23, 42, 0.8)',
                                border: '1px solid rgba(148, 163, 184, 0.3)',
                                color: '#e2e8f0',
                                padding: '0.75rem',
                                borderRadius: '10px',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col md={3} className="text-md-end mt-3 mt-md-0">
                        <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                            Showing <span style={{ color: '#9333ea', fontWeight: '700' }}>{filteredProducts.length}</span> results
                        </div>
                    </Col>
                </Row>
            </Card >

            {isLoading ? <Loader /> : error ? <Message variant="danger">{error?.data?.message || error.error}</Message> : (
                <>
                    {categories.map(cat => {
                        const categoryProducts = filteredProducts.filter(p => p.category.toLowerCase() === cat.name.toLowerCase());

                        if (categoryProducts.length === 0) return null;

                        return (
                            <div key={cat.id} className="mb-5" style={{ marginLeft: '1.5rem', marginRight: '1.5rem' }}>
                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <div style={{
                                        background: `${cat.color}20`,
                                        padding: '10px',
                                        borderRadius: '12px',
                                        border: `1px solid ${cat.color}40`,
                                        color: cat.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <cat.icon size={20} />
                                    </div>
                                    <h3 style={{
                                        color: '#e2e8f0',
                                        fontWeight: '700',
                                        margin: 0,
                                        fontSize: '1.5rem'
                                    }}>
                                        {cat.name}
                                    </h3>
                                    <Badge style={{
                                        background: 'rgba(148, 163, 184, 0.1)',
                                        color: '#94a3b8',
                                        fontWeight: '500',
                                        border: '1px solid rgba(148, 163, 184, 0.2)'
                                    }}>
                                        {categoryProducts.length}
                                    </Badge>
                                </div>

                                <Row>
                                    {categoryProducts.map((product) => (
                                        <Col key={product._id} lg={4} md={6} className="mb-4">
                                            <Card style={{
                                                background: '#0f172a',
                                                border: '1px solid rgba(148, 163, 184, 0.15)',
                                                borderRadius: '16px',
                                                overflow: 'hidden',
                                                transition: 'all 0.3s ease',
                                                height: '100%'
                                            }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                                    e.currentTarget.style.boxShadow = `0 10px 30px ${cat.color}20`;
                                                    e.currentTarget.style.borderColor = `${cat.color}40`;
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                    e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.15)';
                                                }}
                                            >
                                                <div style={{
                                                    position: 'relative',
                                                    width: '100%',
                                                    height: '220px',
                                                    background: '#1e293b'
                                                }}>
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover'
                                                        }}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&h=600&fit=crop';
                                                        }}
                                                    />
                                                </div>

                                                <Card.Body style={{ padding: '1.5rem' }}>
                                                    <div className="mb-3">
                                                        <h5 style={{
                                                            color: '#f8fafc',
                                                            fontWeight: '700',
                                                            fontSize: '1.15rem',
                                                            marginBottom: '0.5rem',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 1,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden'
                                                        }}>
                                                            {product.name}
                                                        </h5>
                                                        <div className="d-flex gap-1 mb-2">
                                                            {product.colors && product.colors.map((color, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    style={{
                                                                        width: '12px',
                                                                        height: '12px',
                                                                        borderRadius: '50%',
                                                                        background: color,
                                                                        border: '1px solid rgba(255,255,255,0.2)'
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                                        <h4 style={{ color: '#22c55e', fontWeight: '800', margin: 0 }}>
                                                            ₹{product.price.toLocaleString()}
                                                        </h4>
                                                        <Badge style={{
                                                            background: product.countInStock > 15 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                            color: product.countInStock > 15 ? '#22c55e' : '#ef4444',
                                                            border: `1px solid ${product.countInStock > 15 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                                                            padding: '0.4rem 0.8rem',
                                                            borderRadius: '6px'
                                                        }}>
                                                            Stock: {product.countInStock}
                                                        </Badge>
                                                    </div>

                                                    <div className="d-flex gap-2">
                                                        <Button
                                                            className="flex-grow-1"
                                                            style={{
                                                                background: 'rgba(99, 102, 241, 0.1)',
                                                                border: '2px solid #6366f1',
                                                                color: '#6366f1',
                                                                padding: '0.6rem',
                                                                fontWeight: '700',
                                                                borderRadius: '12px',
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                            onClick={() => handleEditClick(product)}
                                                            onMouseOver={(e) => {
                                                                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                                                            }}
                                                            onMouseOut={(e) => {
                                                                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                                                            }}
                                                        >
                                                            <FaEdit className="me-2" /> Edit
                                                        </Button>
                                                        <Button
                                                            className="flex-grow-1"
                                                            style={{
                                                                background: 'rgba(239, 68, 68, 0.1)',
                                                                border: '2px solid #ef4444',
                                                                color: '#ef4444',
                                                                padding: '0.6rem',
                                                                fontWeight: '700',
                                                                borderRadius: '12px',
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                            onClick={() => handleDeleteClick(product)}
                                                            onMouseOver={(e) => {
                                                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                                                            }}
                                                            onMouseOut={(e) => {
                                                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                                            }}
                                                        >
                                                            <FaTrash className="me-2" /> Delete
                                                        </Button>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        );
                    })}

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-5">
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
                            <h4 style={{ color: '#e2e8f0' }}>No products found</h4>
                            <p style={{ color: '#94a3b8' }}>Try adjusting your search term</p>
                        </div>
                    )}
                </>
            )}

            <Modal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                centered
                contentClassName="lunar-modal edit-product-modal"
                style={{ backdropFilter: 'blur(8px)' }}
            >
                <Modal.Header closeButton closeVariant="white" style={{ background: '#0f172a', borderBottom: '1px solid rgba(148, 163, 184, 0.2)' }}>
                    <Modal.Title style={{ color: '#f8fafc', fontWeight: '700' }}>Edit Product</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: '#0f172a', color: '#e2e8f0', padding: '2rem' }}>
                    {editProductData && (
                        <Form onSubmit={handleUpdateSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Product Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={editProductData.name}
                                    onChange={handleEditChange}
                                    required
                                    style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(148, 163, 184, 0.2)', color: '#fff', padding: '0.75rem' }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Category</Form.Label>
                                <Form.Select
                                    name="category"
                                    value={editProductData.category}
                                    onChange={handleEditChange}
                                    style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(148, 163, 184, 0.2)', color: '#fff', padding: '0.75rem' }}
                                >
                                    <option value="">Choose category</option>
                                    <option value="Wall Art">Wall Art</option>
                                    <option value="Vases">Vases</option>
                                    <option value="Scented Candles">Scented Candles</option>
                                    <option value="Mirrors">Mirrors</option>
                                    <option value="Lighting">Lighting</option>
                                    <option value="Wallpaper">Wallpaper</option>
                                </Form.Select>
                            </Form.Group>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Price (₹)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="price"
                                            value={editProductData.price}
                                            onChange={handleEditChange}
                                            required
                                            min="0"
                                            style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(148, 163, 184, 0.2)', color: '#fff', padding: '0.75rem' }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Stock Quantity</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="countInStock"
                                            value={editProductData.countInStock}
                                            onChange={handleEditChange}
                                            required
                                            min="0"
                                            style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(148, 163, 184, 0.2)', color: '#fff', padding: '0.75rem' }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={editProductData.description}
                                    onChange={handleEditChange}
                                    style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(148, 163, 184, 0.2)', color: '#fff', padding: '0.75rem' }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem', display: 'block', fontWeight: '600' }}>PRODUCT IMAGE</Form.Label>

                                <div className="d-flex gap-2 mb-4">
                                    <Button
                                        variant={editImageMode === 'upload' ? 'info' : 'outline-info'}
                                        onClick={() => setEditImageMode('upload')}
                                        style={{ borderRadius: '10px', fontWeight: '700', fontSize: '0.85rem' }}
                                    >
                                        UPLOAD FILE
                                    </Button>
                                    <Button
                                        variant={editImageMode === 'link' ? 'info' : 'outline-info'}
                                        onClick={() => {
                                            setEditImageMode('link');
                                            setEditProductData(prev => ({ ...prev, image: '' }));
                                        }}
                                        style={{ borderRadius: '10px', fontWeight: '700', fontSize: '0.85rem' }}
                                    >
                                        IMAGE LINK
                                    </Button>
                                </div>

                                <div className="d-flex align-items-center gap-4">
                                    <div style={{ width: '100px', height: '100px', borderRadius: '16px', overflow: 'hidden', background: '#1e293b', border: '1px solid rgba(148, 163, 184, 0.2)', flexShrink: 0, position: 'relative' }}>
                                        <img src={editImagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&h=400&fit=crop';
                                        }} />
                                        <div
                                            onClick={handleCropClick}
                                            style={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                background: 'rgba(6, 182, 212, 0.8)',
                                                color: 'white',
                                                fontSize: '0.65rem',
                                                fontWeight: '800',
                                                textAlign: 'center',
                                                padding: '2px 0',
                                                cursor: 'pointer',
                                                backdropFilter: 'blur(4px)'
                                            }}
                                        >
                                            CROP
                                        </div>
                                    </div>

                                    <div className="flex-grow-1">
                                        {editImageMode === 'upload' ? (
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={handleEditImageChange}
                                                style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(148, 163, 184, 0.2)', color: '#fff', padding: '0.75rem', borderRadius: '12px' }}
                                            />
                                        ) : (
                                            <Form.Control
                                                type="text"
                                                placeholder="Paste an evocative image URL..."
                                                name="image"
                                                value={editProductData.image}
                                                onChange={(e) => {
                                                    const url = e.target.value;
                                                    setEditProductData(prev => ({ ...prev, image: url }));
                                                    setEditImagePreview(url);
                                                }}
                                                style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(148, 163, 184, 0.2)', color: '#fff', padding: '0.75rem', borderRadius: '12px' }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem', display: 'block', fontWeight: '600' }}>AVAILABLE COLORS</Form.Label>
                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <Form.Control
                                        type="color"
                                        value={currentColor}
                                        onChange={(e) => setCurrentColor(e.target.value)}
                                        style={{ width: '60px', height: '50px', padding: '4px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                                    />
                                    <Form.Control
                                        type="text"
                                        placeholder="Color name (e.g. white) or #hex"
                                        value={currentColor}
                                        onChange={(e) => setCurrentColor(e.target.value)}
                                        style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(148, 163, 184, 0.2)', color: '#c7d2fe', padding: '0.75rem', borderRadius: '12px', width: '220px' }}
                                    />
                                    <Button
                                        onClick={addEditColor}
                                        style={{
                                            background: 'rgba(99, 102, 241, 0.1)',
                                            border: '2px solid #6366f1',
                                            color: '#6366f1',
                                            borderRadius: '12px',
                                            fontWeight: '700',
                                            padding: '0.6rem 1.5rem'
                                        }}
                                    >
                                        Add
                                    </Button>
                                </div>
                                <div className="d-flex flex-wrap gap-2">
                                    {editProductData.colors && editProductData.colors.map((color, idx) => (
                                        <div
                                            key={idx}
                                            className="d-flex align-items-center gap-2 px-2 py-1"
                                            style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '20px' }}
                                        >
                                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: color }} />
                                            <span
                                                style={{ color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}
                                                onClick={() => removeEditColor(color)}
                                            >×</span>
                                        </div>
                                    ))}
                                </div>
                            </Form.Group>

                            <div className="d-flex gap-2 mt-4">
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowEditModal(false)}
                                    style={{ flex: 1, background: 'rgba(148, 163, 184, 0.1)', border: '1px solid rgba(148, 163, 184, 0.2)', color: '#e2e8f0', fontWeight: '600' }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isUpdating}
                                    style={{
                                        flex: 2,
                                        background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                                        border: 'none',
                                        fontWeight: '700',
                                        borderRadius: '12px',
                                        boxShadow: '0 8px 15px -3px rgba(6, 182, 212, 0.3)'
                                    }}
                                >
                                    {isUpdating ? 'Saving...' : 'SAVE CHANGES'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>

            <Modal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                centered
                contentClassName="lunar-modal-delete"
            >
                <Modal.Body style={{ background: '#0f172a', color: '#e2e8f0', padding: '2rem', textAlign: 'center', borderRadius: '16px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                    <h4 style={{ fontWeight: '700', marginBottom: '1rem' }}>Delete Product?</h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' }}>
                        Are you sure you want to delete <strong>{productToDelete?.name}</strong>?
                    </p>
                    <div className="d-flex gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => setShowDeleteModal(false)}
                            style={{ flex: 1, background: 'rgba(148, 163, 184, 0.1)', border: '1px solid rgba(148, 163, 184, 0.2)', color: '#e2e8f0', fontWeight: '600' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            style={{
                                flex: 1,
                                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                border: 'none',
                                fontWeight: '700',
                                borderRadius: '12px',
                                boxShadow: '0 8px 15px -3px rgba(239, 68, 68, 0.3)'
                            }}
                        >
                            {isDeleting ? 'Deleting...' : 'YES, DELETE'}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={showCropper} onHide={() => setShowCropper(false)} centered contentClassName="lunar-cropper-modal">
                <Modal.Body style={{ height: '100%', position: 'relative', background: '#0f172a', padding: 0, borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1, background: '#000', overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        {imageToCrop && (
                            <ReactCrop
                                crop={crop}
                                onChange={(c) => setCrop(c)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={undefined}
                            >
                                <img
                                    src={imageToCrop}
                                    onLoad={(e) => setImageRef(e.currentTarget)}
                                    alt="Crop me"
                                    style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain' }}
                                />
                            </ReactCrop>
                        )}
                    </div>
                    <div style={{ padding: '2rem', background: '#0f172a', borderTop: '1px solid rgba(148, 163, 184, 0.1)' }}>
                        <div className="d-flex gap-3">
                            <Button
                                variant="outline-light"
                                className="flex-grow-1"
                                onClick={() => setShowCropper(false)}
                                style={{ border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '12px', fontWeight: '700', padding: '0.8rem' }}
                            >
                                CANCEL
                            </Button>
                            <Button
                                className="flex-grow-1"
                                onClick={handleCropSave}
                                style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', border: 'none', borderRadius: '12px', fontWeight: '700', padding: '0.8rem' }}
                            >
                                SAVE CROP
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <style>{`
                .category-card:hover .card-bg-image {
                  transform: scale(1.1);
                }
                .category-card:hover {
                  transform: translateY(-10px);
                  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
                  border-color: rgba(255, 255, 255, 0.2);
                }
                .category-card:hover .color-glow {
                  opacity: 0.4;
                }
                .lunar-modal .modal-content, .lunar-modal-delete .modal-content {
                    border-radius: 16px;
                    border: 1px solid rgba(147, 51, 234, 0.3);
                    box-shadow: 0 0 40px rgba(0,0,0,0.5);
                }
                .edit-product-modal .modal-content {
                    width: 98vh !important;
                    max-width: 98vh !important;
                    min-height: 80vh !important;
                    margin: auto;
                }
                .lunar-modal-delete .modal-content {
                    width: 50vh !important;
                    max-width: 50vh !important;
                    min-height: 60vh !important;
                    margin: auto;
                    border-color: rgba(239, 68, 68, 0.3);
                    border-radius: 16px;
                }
                .lunar-cropper-modal {
                    width: 95vw !important;
                    max-width: 95vw !important;
                    height: 95vh !important;
                    margin: auto;
                    border-radius: 16px;
                    overflow: hidden;
                    border: 1px solid rgba(6, 182, 212, 0.3);
                }
                .lunar-modal .btn-close {
                    filter: invert(1) grayscale(100%) brightness(200%);
                }
                select.form-select {
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
                    background-repeat: no-repeat;
                    background-position: right 1rem center;
                    background-size: 16px 12px;
                }
            `}</style>
        </>
    );
};

export default SellerProductsPage;
