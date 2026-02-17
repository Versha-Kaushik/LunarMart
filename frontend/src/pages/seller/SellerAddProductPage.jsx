import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Image, InputGroup, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaUpload, FaPlus, FaTrophy, FaMagic, FaBox, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCreateProductMutation } from '../../slices/productsApiSlice';
import Meta from '../../components/Meta';
import Loader from '../../components/Loader';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getCroppedImg } from '../../utils/cropImage';
import { Modal } from 'react-bootstrap';

const SellerAddProductPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        category: '',
        description: '',
        price: '',
        countInStock: '',
        image: '',
        colors: []
    });

    const [imagePreview, setImagePreview] = useState('');
    const [currentColor, setCurrentColor] = useState('#6366f1');
    const [imageMode, setImageMode] = useState('upload');

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

    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageToCrop(reader.result);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUrlChange = (e) => {
        const url = e.target.value;
        setFormData(prev => ({ ...prev, image: url }));
        setImagePreview(url);
        setImageToCrop(url);
    };

    const handleCropClick = () => {
        if (!imagePreview) {
            toast.error('Please select or link an image first');
            return;
        }
        setImageToCrop(imagePreview);
        setShowCropper(true);
    };


    const onCropComplete = (pixelCrop) => {
        setCompletedCrop(pixelCrop);
    };

    const handleCropSave = async () => {
        
        const activeCrop = completedCrop || (crop.unit === 'px' ? crop : null);

        if (activeCrop?.width && activeCrop?.height && imageRef) {
            try {
                const scaleX = imageRef.naturalWidth / imageRef.width;
                const scaleY = imageRef.naturalHeight / imageRef.height;
                
                const pixelCrop = {
                    x: activeCrop.x * scaleX,
                    y: activeCrop.y * scaleY,
                    width: activeCrop.width * scaleX,
                    height: activeCrop.height * scaleY,
                };
                
                const croppedImage = await getCroppedImg(imageToCrop, pixelCrop);

                if (!croppedImage) {
                    throw new Error('Cropped image is null');
                }

                setImagePreview(croppedImage);
                setFormData(prev => ({ ...prev, image: croppedImage }));
                setShowCropper(false);
                toast.success('Image cropped successfully!');
            } catch (e) {
                console.error('handleCropSave - Error:', e);
                const isCorsError = e.message?.includes('tainted') || e.name === 'SecurityError';
                toast.error(isCorsError ? 'Cannot crop this external image due to security restrictions (CORS).' : 'Failed to crop image. Please try another one.');
            }
        } else {
            console.warn('handleCropSave - Missing data or crop not started:', { width: activeCrop?.width, height: activeCrop?.height, imageRef: !!imageRef });
            toast.info('Please move the crop area slightly to activate it.');
        }
    };

    const addColor = () => {
        if (!formData.colors.includes(currentColor)) {
            setFormData(prev => ({
                ...prev,
                colors: [...prev.colors, currentColor]
            }));
        }
    };

    const removeColor = (colorToRemove) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.filter(c => c !== colorToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.price || !formData.countInStock) {
            console.warn('Validation failed: Missing required fields');
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const res = await createProduct({
                ...formData,
                price: parseFloat(formData.price) || 0,
                countInStock: parseInt(formData.countInStock) || 0
            }).unwrap();

            toast.success('Product launched successfully!');
            navigate('/seller/home');
        } catch (error) {
            console.error('Failed to create product:', error);
            toast.error(error?.data?.message || 'Failed to create product');
        }
    };

    const cardStyle = {
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    };

    const inputStyle = {
        background: 'rgba(30, 41, 59, 0.5)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        color: '#f8fafc',
        borderRadius: '12px',
        padding: '0.8rem 1rem',
        fontSize: '1rem',
        transition: 'all 0.3s ease'
    };

    const labelStyle = {
        color: '#94a3b8',
        fontSize: '0.85rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '0.5rem'
    };

    return (
        <>
            <Meta title="Create Masterpiece" />

            <div className="d-flex align-items-center mb-4">
                <div style={{
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    padding: '12px',
                    borderRadius: '16px',
                    marginRight: '1.5rem',
                    marginLeft: '1.5rem',
                    boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
                }}>
                    <FaMagic color="white" size={24} />
                </div>
                <div>
                    <h1 style={{ color: '#f8fafc', fontWeight: '800', margin: 0, fontSize: '2.5rem' }}>
                        Create a Masterpiece
                    </h1>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '1.1rem' }}>
                        Launch your next best-seller into the LunarMart universe.
                    </p>
                </div>
            </div>

            <Row className="g-5" style={{ marginLeft: '1.5rem', marginBottom: '1.5rem', marginRight: '1.5rem' }}>
                <Col lg={7}>
                    <Card style={cardStyle}>
                        <Card.Body style={{ padding: '2.5rem' }}>
                            <Form onSubmit={handleSubmit}>
                                <div className="mb-5">

                                    <Form.Group className="mb-4" controlId="name">
                                        <Form.Label style={labelStyle}>Product Name *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter an evocative name..."
                                            required
                                            style={inputStyle}
                                            className="custom-input"
                                        />
                                    </Form.Group>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-4" controlId="brand">
                                                <Form.Label style={labelStyle}>Brand</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="brand"
                                                    value={formData.brand}
                                                    onChange={handleInputChange}
                                                    placeholder="Manufacturer identity"
                                                    style={inputStyle}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-4" controlId="category">
                                                <Form.Label style={labelStyle}>Category</Form.Label>
                                                <Form.Select
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleInputChange}
                                                    style={inputStyle}
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
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-4" controlId="description">
                                        <Form.Label style={labelStyle}>Description</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={5}
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Tell the story of this product..."
                                            style={{ ...inputStyle, resize: 'none' }}
                                        />
                                    </Form.Group>
                                </div>

                                <div className="mb-5">
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-4" controlId="price">
                                                <Form.Label style={labelStyle}>Price (₹) *</Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Text style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(148, 163, 184, 0.2)', color: '#94a3b8', borderRadius: '12px 0 0 12px' }}>₹</InputGroup.Text>
                                                    <Form.Control
                                                        type="number"
                                                        name="price"
                                                        value={formData.price}
                                                        onChange={handleInputChange}
                                                        placeholder="0.00"
                                                        required
                                                        min="0"
                                                        style={{ ...inputStyle, borderRadius: '0 12px 12px 0' }}
                                                    />
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-4" controlId="countInStock">
                                                <Form.Label style={labelStyle}>Inventory Balance *</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="countInStock"
                                                    value={formData.countInStock}
                                                    onChange={handleInputChange}
                                                    placeholder="Available stock"
                                                    required
                                                    min="0"
                                                    style={inputStyle}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </div>

                                <div className="mb-5">
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div style={{ position: 'relative' }}>
                                            <Form.Control
                                                type="color"
                                                value={currentColor}
                                                onChange={(e) => setCurrentColor(e.target.value)}
                                                style={{ width: '60px', height: '50px', padding: '4px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                                            />
                                        </div>
                                        <Form.Control
                                            type="text"
                                            placeholder="Color name or #hex"
                                            value={currentColor}
                                            onChange={(e) => setCurrentColor(e.target.value)}
                                            style={{ ...inputStyle, width: '180px' }}
                                        />
                                        <Button
                                            onClick={addColor}
                                            style={{
                                                background: 'rgba(99, 102, 241, 0.1)',
                                                border: '2px solid #6366f1',
                                                color: '#6366f1',
                                                borderRadius: '12px',
                                                padding: '0.6rem 1.5rem',
                                                fontWeight: '700'
                                            }}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                    <div className="d-flex flex-wrap gap-3 p-4 mb-4" style={{ background: 'rgba(30, 41, 59, 0.3)', borderRadius: '16px', border: '1px dashed rgba(148, 163, 184, 0.2)' }}>
                                        {formData.colors.length === 0 && (
                                            <span style={{ color: '#64748b', fontStyle: 'italic' }}>No shades added yet...</span>
                                        )}
                                        {formData.colors.map((color, idx) => (
                                            <div
                                                key={idx}
                                                className="d-flex align-items-center gap-3 px-3 py-2"
                                                style={{ background: '#1e293b', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '12px' }}
                                            >
                                                <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: color, border: '2px solid rgba(255,255,255,0.1)' }} />
                                                <span style={{ color: '#f8fafc', fontSize: '0.85rem', fontFamily: 'monospace' }}>{color.toUpperCase()}</span>
                                                <FaTimes
                                                    style={{ color: '#ef4444', cursor: 'pointer' }}
                                                    onClick={() => removeColor(color)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div className="d-flex gap-2">
                                            <Button
                                                variant={imageMode === 'upload' ? 'info' : 'outline-info'}
                                                onClick={() => setImageMode('upload')}
                                                style={{ borderRadius: '10px', fontWeight: '600' }}
                                            >
                                                Upload File
                                            </Button>
                                            <Button
                                                variant={imageMode === 'link' ? 'info' : 'outline-info'}
                                                onClick={() => setImageMode('link')}
                                                style={{ borderRadius: '10px', fontWeight: '600' }}
                                            >
                                                Image Link
                                            </Button>
                                        </div>
                                    </div>

                                    {imageMode === 'upload' ? (
                                        <div
                                            style={{
                                                border: '3px dashed rgba(99, 102, 241, 0.3)',
                                                borderRadius: '20px',
                                                padding: '3rem',
                                                textAlign: 'center',
                                                background: 'rgba(99, 102, 241, 0.03)',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                position: 'relative'
                                            }}
                                            onClick={() => document.getElementById('imageUpload').click()}
                                            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = 'rgba(99, 102, 241, 0.07)'; }}
                                            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)'; e.currentTarget.style.background = 'rgba(99, 102, 241, 0.03)'; }}
                                        >
                                            <div style={{ background: 'rgba(6, 182, 212, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '2px solid rgba(6, 182, 212, 0.2)' }}>
                                                <FaUpload size={24} color="#06b6d4" />
                                            </div>
                                            <h5 style={{ color: '#f8fafc', fontWeight: '600' }}>Drop image here or click to browse</h5>
                                            <p style={{ color: '#64748b', marginBottom: 0 }}>High resolution PNG or JPG (Max 5MB)</p>
                                            <Form.Control
                                                id="imageUpload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                style={{ display: 'none' }}
                                            />
                                        </div>
                                    ) : (
                                        <Form.Group controlId="imageUrl">
                                            <Form.Label style={labelStyle}>Image Link</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Paste an evocative image URL..."
                                                    value={formData.image}
                                                    onChange={handleImageUrlChange}
                                                    style={{ ...inputStyle, borderRadius: '12px 0 0 12px' }}
                                                />
                                                <Button
                                                    variant="info"
                                                    onClick={handleCropClick}
                                                    style={{ borderRadius: '0 12px 12px 0', fontWeight: '700' }}
                                                >
                                                    CROP
                                                </Button>
                                            </InputGroup>
                                        </Form.Group>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isCreating}
                                    style={{
                                        background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                                        border: 'none',
                                        padding: '1.2rem',
                                        fontWeight: '800',
                                        width: '100%',
                                        borderRadius: '16px',
                                        fontSize: '1.2rem',
                                        marginTop: '1rem',
                                        boxShadow: '0 10px 20px -5px rgba(6, 182, 212, 0.4)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {isCreating ? (
                                        <Loader />
                                    ) : (
                                        <>
                                            <FaPlus className="me-3" />
                                            LAUNCH PRODUCT
                                        </>
                                    )}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={5}>
                    <div style={{ position: 'sticky', top: '2rem' }}>
                        <h4 style={{ color: '#f8fafc', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                            Live Projection
                        </h4>

                        <Card style={{ ...cardStyle, background: 'rgba(30, 41, 59, 0.4)' }}>
                            <div style={{ height: '400px', background: '#0f172a', position: 'relative' }}>
                                {imagePreview ? (
                                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                        <img
                                            key={imagePreview}
                                            src={imagePreview}
                                            alt="Preview"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <div
                                            onClick={handleCropClick}
                                            style={{
                                                position: 'absolute',
                                                top: '1rem',
                                                right: '1rem',
                                                background: 'rgba(6, 182, 212, 0.8)',
                                                color: 'white',
                                                padding: '0.4rem 1rem',
                                                borderRadius: '8px',
                                                fontSize: '0.8rem',
                                                fontWeight: '800',
                                                cursor: 'pointer',
                                                backdropFilter: 'blur(4px)',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.background = '#06b6d4'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.8)'}
                                        >
                                        </div>
                                    </div>
                                ) : (
                                    <div className="d-flex flex-column align-items-center justify-content-center h-100" style={{ color: '#334155' }}>
                                        <FaBox size={80} style={{ opacity: 0.2 }} />
                                        <p className="mt-4" style={{ opacity: 0.5, fontWeight: '600' }}>NO VISUAL READY</p>
                                    </div>
                                )}
                                <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }}>
                                    <Badge style={{ background: 'rgba(99, 102, 241, 0.8)', padding: '0.6rem 1rem', borderRadius: '8px', marginBottom: '0.75rem' }}>
                                        {formData.category || 'CATEGORY'}
                                    </Badge>
                                    <h3 style={{ color: 'white', fontWeight: '800', textShadow: '0 2px 4px rgba(0,0,0,0.5)', margin: 0 }}>
                                        {formData.name || 'Your Product Title'}
                                    </h3>
                                </div>
                            </div>
                            <Card.Body style={{ padding: '2rem' }}>
                                <div className="d-flex justify-content-between align-items-end mb-4">
                                    <div>
                                        <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.8rem', fontWeight: '700' }}>BRAND IDENTITY</p>
                                        <h5 style={{ color: '#e2e8f0', margin: 0, fontWeight: '700' }}>{formData.brand || '---'}</h5>
                                    </div>
                                    <div className="text-end">
                                        <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.8rem', fontWeight: '700' }}>VALUATION</p>
                                        <h2 style={{ color: '#fbbf24', margin: 0, fontWeight: '900' }}>₹{formData.price || '0'}</h2>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.8rem', fontWeight: '700' }}>DESCRIPTION SNIPPET</p>
                                    <p style={{ color: '#cbd5e1', fontSize: '0.95rem', margin: '0.5rem 0', minHeight: '3rem' }}>
                                        {formData.description || 'Start writing to see your description placeholder populate here...'}
                                    </p>
                                </div>

                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex gap-2">
                                        {formData.colors.map((color, idx) => (
                                            <div
                                                key={idx}
                                                style={{ width: '20px', height: '20px', borderRadius: '50%', background: color, border: '2px solid rgba(255,255,255,0.2)' }}
                                            />
                                        ))}
                                    </div>
                                    <div style={{ color: formData.countInStock > 0 ? '#22c55e' : '#f43f5e', fontSize: '0.9rem', fontWeight: '700' }}>
                                        {formData.countInStock || '0'} PIECES REMAINING
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>

            <Modal show={showCropper} onHide={() => setShowCropper(false)} centered size="lg" contentClassName="cropper-modal">
                <Modal.Header closeButton className="bg-dark text-white border-secondary">
                    <Modal.Title>Crop Product Image</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark p-0" style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto' }}>
                    {imageToCrop && (
                        <ReactCrop
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            onComplete={onCropComplete}
                            aspect={undefined}
                        >
                            <img
                                src={imageToCrop}
                                onLoad={(e) => setImageRef(e.currentTarget)}
                                alt="Crop me"
                                style={{ maxWidth: '100%', maxHeight: '450px', objectFit: 'contain' }}
                            />
                        </ReactCrop>
                    )}
                </Modal.Body>
                <Modal.Footer className="bg-dark border-secondary">
                    <Button variant="secondary" onClick={() => setShowCropper(false)}>Cancel</Button>
                    <Button variant="info" onClick={handleCropSave}>Save Crop</Button>
                </Modal.Footer>
            </Modal>

            <style>{`
                .cropper-modal .modal-content {
                    border-radius: 20px;
                    overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .custom-input:focus {
                    background: rgba(30, 41, 59, 0.8) !important;
                    border-color: #6366f1 !important;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2) !important;
                    color: white !important;
                }
                .custom-input::placeholder {
                    color: #475569 !important;
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

export default SellerAddProductPage;
