import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, ListGroup, Image, Spinner, InputGroup } from 'react-bootstrap';
import { useGetOrderDetailsQuery, useReturnOrderMutation } from '../slices/ordersApiSlice';
import { useUploadProductImageMutation } from '../slices/productsApiSlice';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaUndo, FaUpload, FaVideo, FaCommentAlt, FaBoxOpen, FaLink, FaFileImage } from 'react-icons/fa';
import Meta from '../components/Meta';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { addCurrency } from '../utils/addCurrency';

const ReturnOrderPage = () => {
    const { id: orderId } = useParams();
    const navigate = useNavigate();

    const [returnReason, setReturnReason] = useState('');
    const [returnImage, setReturnImage] = useState('');
    const [returnVideo, setReturnVideo] = useState('');
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [isUploadingVideo, setIsUploadingVideo] = useState(false);

    const { data: order, isLoading, error } = useGetOrderDetailsQuery(orderId);
    const [returnOrder, { isLoading: isReturnLoading }] = useReturnOrderMutation();
    const [uploadFile] = useUploadProductImageMutation();

    const uploadFileHandler = async (e, type) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);

        if (type === 'image') setIsUploadingImage(true);
        else setIsUploadingVideo(true);

        try {
            const res = await uploadFile(formData).unwrap();
            if (type === 'image') setReturnImage(res.imageUrl);
            else setReturnVideo(res.imageUrl);
            toast.success(res.message);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        } finally {
            if (type === 'image') setIsUploadingImage(false);
            else setIsUploadingVideo(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!returnReason.trim()) {
            toast.error('Please provide a reason for return');
            return;
        }

        try {
            await returnOrder({
                orderId,
                returnReason,
                returnImage,
                returnVideo,
            }).unwrap();
            toast.success('Return request submitted successfully');
            navigate(`/order/${orderId}`);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <Container className='py-5'>
            <Meta title='Return Order' />
            <style>
                {`
          .return-form-control::placeholder {
            color: #94a3b8 !important;
            opacity: 0.8 !important;
          }
          .upload-label {
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: rgba(52, 211, 153, 0.1);
            border: 1px dashed #34d399;
            border-radius: 8px;
            color: #34d399;
            font-size: 0.9rem;
            transition: all 0.3s;
          }
          .upload-label:hover {
            background: rgba(52, 211, 153, 0.2);
          }
        `}
            </style>
            <div className='d-flex align-items-center mb-4'>
                <Button
                    variant='link'
                    className='p-0 me-3 text-success'
                    onClick={() => navigate(-1)}
                    style={{ fontSize: '1.5rem', textDecoration: 'none' }}
                >
                    <FaArrowLeft />
                </Button>
                <h1 className='m-0 fw-bold' style={{ color: '#fff', fontSize: '2rem' }}>Return Order</h1>
            </div>

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error?.data?.message || error.error}</Message>
            ) : (
                <Row className='g-4'>
                    <Col lg={7}>
                        <Card style={{
                            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)',
                            border: '1px solid rgba(52, 211, 153, 0.3)',
                            borderRadius: '20px',
                            padding: '2rem',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                        }}>
                            <Form onSubmit={submitHandler}>
                                <Form.Group className='mb-4'>
                                    <Form.Label style={{ color: '#34d399', fontWeight: '700', fontSize: '1.1rem' }}>
                                        <FaCommentAlt className='me-2' /> Why are you returning this?
                                    </Form.Label>
                                    <Form.Control
                                        as='textarea'
                                        rows={4}
                                        placeholder='Please describe the issue in detail...'
                                        className='return-form-control'
                                        value={returnReason}
                                        onChange={(e) => setReturnReason(e.target.value)}
                                        required
                                        style={{
                                            backgroundColor: 'rgba(15, 23, 42, 0.6)',
                                            border: '1px solid rgba(52, 211, 153, 0.4)',
                                            color: '#e2e8f0',
                                            borderRadius: '12px',
                                            padding: '1rem'
                                        }}
                                    />
                                </Form.Group>

                                <Form.Group className='mb-4'>
                                    <div className='d-flex justify-content-between align-items-center mb-2'>
                                        <Form.Label className='m-0' style={{ color: '#34d399', fontWeight: '700', fontSize: '1.1rem' }}>
                                            <FaFileImage className='me-2' /> Proof Image
                                        </Form.Label>
                                        <label className='upload-label'>
                                            {isUploadingImage ? <Spinner animation='border' size='sm' /> : <><FaUpload /> Upload Image</>}
                                            <input type='file' hidden onChange={(e) => uploadFileHandler(e, 'image')} accept='image/*' />
                                        </label>
                                    </div>
                                    <InputGroup>
                                        <InputGroup.Text style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(52, 211, 153, 0.4)', color: '#94a3b8' }}>
                                            <FaLink />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type='text'
                                            placeholder='Or paste image URL here'
                                            className='return-form-control'
                                            value={returnImage}
                                            onChange={(e) => setReturnImage(e.target.value)}
                                            style={{
                                                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                                                border: '1px solid rgba(52, 211, 153, 0.4)',
                                                color: '#e2e8f0',
                                                borderLeft: 'none'
                                            }}
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className='mb-5'>
                                    <div className='d-flex justify-content-between align-items-center mb-2'>
                                        <Form.Label className='m-0' style={{ color: '#34d399', fontWeight: '700', fontSize: '1.1rem' }}>
                                            <FaVideo className='me-2' /> Proof Video (Optional)
                                        </Form.Label>
                                        <label className='upload-label'>
                                            {isUploadingVideo ? <Spinner animation='border' size='sm' /> : <><FaUpload /> Upload Video</>}
                                            <input type='file' hidden onChange={(e) => uploadFileHandler(e, 'video')} accept='video/*' />
                                        </label>
                                    </div>
                                    <InputGroup>
                                        <InputGroup.Text style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(52, 211, 153, 0.4)', color: '#94a3b8' }}>
                                            <FaLink />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type='text'
                                            placeholder='Or paste video URL here'
                                            className='return-form-control'
                                            value={returnVideo}
                                            onChange={(e) => setReturnVideo(e.target.value)}
                                            style={{
                                                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                                                border: '1px solid rgba(52, 211, 153, 0.4)',
                                                color: '#e2e8f0',
                                                borderLeft: 'none'
                                            }}
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <Button
                                    type='submit'
                                    disabled={isReturnLoading || isUploadingImage || isUploadingVideo}
                                    style={{
                                        background: 'linear-gradient(135deg, #10b981, #059669)',
                                        border: 'none',
                                        fontWeight: '800',
                                        padding: '16px',
                                        fontSize: '1.2rem',
                                        borderRadius: '12px',
                                        width: '100%',
                                        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                                        transition: 'transform 0.2s'
                                    }}
                                    onMouseEnter={(e) => !isReturnLoading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    {isReturnLoading ? (
                                        <><Spinner animation='border' size='sm' className='me-2' /> Submitting...</>
                                    ) : (
                                        <><FaUndo className='me-2' /> Submit Return Request</>
                                    )}
                                </Button>
                            </Form>
                        </Card>
                    </Col>

                    <Col lg={5}>
                        <Card style={{
                            background: 'rgba(30, 41, 59, 0.5)',
                            border: '1px solid rgba(148, 163, 184, 0.2)',
                            borderRadius: '20px',
                            overflow: 'hidden'
                        }}>
                            <Card.Header className='bg-dark py-3 border-secondary'>
                                <h5 className='m-0 fw-bold'><FaBoxOpen className='me-2 text-success' /> Order Summary</h5>
                            </Card.Header>
                            <Card.Body className='p-0'>
                                <ListGroup variant='flush'>
                                    {order.orderItems.map((item, index) => (
                                        <ListGroup.Item key={index} className='bg-transparent border-secondary text-light p-3'>
                                            <Row className='align-items-center'>
                                                <Col xs={3}>
                                                    <Image src={item.image} alt={item.name} fluid rounded shadow-sm />
                                                </Col>
                                                <Col xs={9}>
                                                    <div className='fw-bold' style={{ fontSize: '0.9rem' }}>{item.name}</div>
                                                    <div className='text-muted' style={{ fontSize: '0.8rem' }}>
                                                        Qty: {item.qty} | {addCurrency(item.price)}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                                <div className='p-4 border-top border-secondary'>
                                    <div className='d-flex justify-content-between mb-2'>
                                        <span>Total Price</span>
                                        <span className='fw-bold text-success' style={{ fontSize: '1.2rem' }}>
                                            {addCurrency(order.totalPrice)}
                                        </span>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default ReturnOrderPage;
