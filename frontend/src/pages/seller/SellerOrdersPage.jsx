import React, { useState } from 'react';
import { Card, Table, Badge, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Meta from '../../components/Meta';
import { toast } from 'react-toastify';
import { useGetSellerOrdersQuery, useUpdateOrderStatusMutation } from '../../slices/ordersApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const SellerOrdersPage = () => {
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [orderToEdit, setOrderToEdit] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    const { data: ordersData, isLoading, error } = useGetSellerOrdersQuery();
    const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    const handleDeleteClick = (orderId) => {
        setOrderToDelete(orderId);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        toast.error('Delete functionality for orders is usually restricted');
        setShowDeleteModal(false);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setOrderToDelete(null);
    };

    const handleEditClick = (order) => {
        setOrderToEdit(order);
        setNewStatus(order.status || 'pending');
        setShowEditModal(true);
    };

    const handleUpdateStatus = async () => {
        try {
            await updateOrderStatus({
                orderId: orderToEdit.fullId,
                status: newStatus
            }).unwrap();
            toast.success('Order status updated successfully');
            setShowEditModal(false);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setOrderToEdit(null);
    };

    const orders = ordersData ? ordersData.filter(order => order._id !== '69906ed8d8714a02130fb77d').flatMap(order =>
        order.orderItems.map(item => ({
            id: order._id.substring(order._id.length - 6).toUpperCase(),
            fullId: order._id,
            customer: order.user?.name || 'Customer',
            product: item.name,
            quantity: item.qty,
            amount: item.qty * item.price,
            status: item.status || (order.isDelivered ? 'delivered' : (order.isPaid ? 'shipped' : 'pending')),
            date: order.createdAt.substring(0, 10),
            paymentMethod: order.isPaid ? 'Paid' : 'COD',
            image: item.image,
            address: `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`
        }))
    ) : [];

    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter(order => order.status === filterStatus);

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'warning',
            shipped: 'info',
            delivered: 'success',
            return_requested: 'danger',
            return_accepted: 'primary'
        };
        return <Badge bg={variants[status] || 'secondary'}>{status.toUpperCase()}</Badge>;
    };

    if (isLoading) return <Loader />;
    if (error) return <Message variant='danger'>{error?.data?.message || error.error}</Message>;

    return (
        <>
            <Meta title="Orders" />

            <div style={{ marginBottom: '2.5rem', marginLeft: '1.5rem', marginRight: '1.5rem', marginTop: '1.5rem' }}>
                <h2 style={{
                    color: '#e2e8f0',
                    fontWeight: '700',
                    marginBottom: '0.5rem',
                    fontSize: '2rem',
                    letterSpacing: '-0.5px'
                }}>
                    Manage Orders
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0 }}>
                    Track and manage all your customer orders
                </p>
            </div>

            <Row className="g-3 mb-4" style={{ marginLeft: '1.5rem', marginRight: '1.5rem' }}>
                <Col style={{ flex: '1 0 20%', minWidth: '200px' }}>
                    <Card style={{
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        height: '100%'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                        }}>
                        <Card.Body className="text-center" style={{ padding: '1.25rem' }}>
                            <h3 style={{
                                color: '#8b5cf6',
                                fontWeight: '700',
                                margin: 0,
                                fontSize: '2rem',
                                textShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
                            }}>
                                {orders.length}
                            </h3>
                            <p style={{
                                color: '#cbd5e1',
                                margin: '0.5rem 0 0 0',
                                fontSize: '0.85rem',
                                fontWeight: '500',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>Total Orders</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col style={{ flex: '1 0 20%', minWidth: '200px' }}>
                    <Card style={{
                        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0.05) 100%)',
                        border: '1px solid rgba(251, 191, 36, 0.3)',
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        height: '100%'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(251, 191, 36, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                        }}>
                        <Card.Body className="text-center" style={{ padding: '1.25rem' }}>
                            <h3 style={{
                                color: '#fbbf24',
                                fontWeight: '700',
                                margin: 0,
                                fontSize: '2rem',
                                textShadow: '0 2px 8px rgba(251, 191, 36, 0.3)'
                            }}>
                                {orders.filter(o => o.status === 'pending').length}
                            </h3>
                            <p style={{
                                color: '#cbd5e1',
                                margin: '0.5rem 0 0 0',
                                fontSize: '0.85rem',
                                fontWeight: '500',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>Pending</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col style={{ flex: '1 0 20%', minWidth: '200px' }}>
                    <Card style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        height: '100%'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                        }}>
                        <Card.Body className="text-center" style={{ padding: '1.25rem' }}>
                            <h3 style={{
                                color: '#3b82f6',
                                fontWeight: '700',
                                margin: 0,
                                fontSize: '2rem',
                                textShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                            }}>
                                {orders.filter(o => o.status === 'shipped').length}
                            </h3>
                            <p style={{
                                color: '#cbd5e1',
                                margin: '0.5rem 0 0 0',
                                fontSize: '0.85rem',
                                fontWeight: '500',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>Shipped</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col style={{ flex: '1 0 20%', minWidth: '200px' }}>
                    <Card style={{
                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        height: '100%'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(34, 197, 94, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                        }}>
                        <Card.Body className="text-center" style={{ padding: '1.25rem' }}>
                            <h3 style={{
                                color: '#22c55e',
                                fontWeight: '700',
                                margin: 0,
                                fontSize: '2rem',
                                textShadow: '0 2px 8px rgba(34, 197, 94, 0.3)'
                            }}>
                                {orders.filter(o => o.status === 'delivered').length}
                            </h3>
                            <p style={{
                                color: '#cbd5e1',
                                margin: '0.5rem 0 0 0',
                                fontSize: '0.85rem',
                                fontWeight: '500',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>Delivered</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col style={{ flex: '1 0 20%', minWidth: '200px' }}>
                    <Card style={{
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        height: '100%'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                        }}>
                        <Card.Body className="text-center" style={{ padding: '1.25rem' }}>
                            <h3 style={{
                                color: '#ef4444',
                                fontWeight: '700',
                                margin: 0,
                                fontSize: '2rem',
                                textShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                            }}>
                                {orders.filter(o => o.status === 'returned').length}
                            </h3>
                            <p style={{
                                color: '#cbd5e1',
                                margin: '0.5rem 0 0 0',
                                fontSize: '0.85rem',
                                fontWeight: '500',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>Returned</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginLeft: '1.5rem' }}>
                    Showing <span style={{ color: '#e2e8f0', fontWeight: '600' }}>{filteredOrders.length}</span> {filterStatus === 'all' ? 'total' : filterStatus} orders
                </div>
                <Form.Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{
                        width: '220px',
                        background: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '8px',
                        color: '#e2e8f0',
                        padding: '0.6rem 1rem',
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        marginRight: '1.5rem'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.3)';
                    }}
                >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="return_requested">Return Requested</option>
                    <option value="return_accepted">Return Accepted</option>
                    <option value="returned">Returned</option>
                </Form.Select>
            </div>

            <Card style={{
                background: '#020617',
                border: '1px solid rgba(148, 163, 184, 0.15)',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                overflow: 'hidden',
                marginLeft: '1.5rem',
                marginRight: '1.5rem',
                marginBottom: '1.5rem',
            }}>
                <Card.Body style={{ padding: 0 }}>
                    <Table hover style={{ marginBottom: 0 }}>
                        <thead>
                            <tr style={{
                                borderBottom: '3px solid #6366f1',
                                background: '#0f172a'
                            }}>
                                <th style={{ color: '#6366f1', fontWeight: '800', padding: '1.5rem 1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', background: '#0f172a' }}>Order ID</th>
                                <th style={{ color: '#6366f1', fontWeight: '800', padding: '1.5rem 1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', background: '#0f172a' }}>Date</th>
                                <th style={{ color: '#6366f1', fontWeight: '800', padding: '1.5rem 1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', background: '#0f172a' }}>Product</th>
                                <th style={{ color: '#6366f1', fontWeight: '800', padding: '1.5rem 1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', background: '#0f172a' }}>Qty</th>
                                <th style={{ color: '#6366f1', fontWeight: '800', padding: '1.5rem 1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', background: '#0f172a' }}>Amount</th>
                                <th style={{ color: '#6366f1', fontWeight: '800', padding: '1.5rem 1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', background: '#0f172a' }}>Payment</th>
                                <th style={{ color: '#6366f1', fontWeight: '800', padding: '1.5rem 1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', background: '#0f172a' }}>Status</th>
                                <th style={{ color: '#6366f1', fontWeight: '800', padding: '1.5rem 1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', background: '#0f172a' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order, index) => (
                                    <tr
                                        key={order.id}
                                        style={{
                                            background: index % 2 === 0 ? 'rgba(30, 64, 175, 0.4)' : 'rgba(17, 24, 39, 0.7)',
                                            borderBottom: '1px solid rgba(34, 211, 238, 0.15)',
                                            transition: 'all 0.2s ease',
                                            cursor: 'default'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.3)';
                                            e.currentTarget.style.transform = 'scale(1.002)';
                                            e.currentTarget.style.boxShadow = 'inset 0 0 10px rgba(34, 211, 238, 0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = index % 2 === 0 ? 'rgba(30, 64, 175, 0.4)' : 'rgba(17, 24, 39, 0.7)';
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <td style={{
                                            color: '#22d3ee',
                                            padding: '1.5rem 1rem',
                                            fontSize: '0.9rem',
                                            fontWeight: '500',
                                            background: '#0f172a',
                                            borderBottom: '1px solid rgba(34, 211, 238, 0.12)'
                                        }}>{order.id}</td>
                                        <td style={{
                                            color: '#22d3ee',
                                            padding: '1.5rem 1rem',
                                            fontSize: '0.9rem',
                                            background: '#0f172a',
                                            borderBottom: '1px solid rgba(34, 211, 238, 0.12)'
                                        }}>{order.date}</td>
                                        <td style={{
                                            color: '#22d3ee',
                                            padding: '1.5rem 1rem',
                                            fontSize: '0.9rem',
                                            fontWeight: '600',
                                            background: '#0f172a',
                                            borderBottom: '1px solid rgba(34, 211, 238, 0.12)'
                                        }}>{order.product}</td>
                                        <td style={{
                                            color: '#22d3ee',
                                            padding: '1.5rem 1rem',
                                            fontSize: '0.9rem',
                                            textAlign: 'center',
                                            fontWeight: '500',
                                            background: '#0f172a',
                                            borderBottom: '1px solid rgba(34, 211, 238, 0.12)'
                                        }}>{order.quantity}</td>
                                        <td style={{
                                            color: '#22d3ee',
                                            padding: '1.5rem 1rem',
                                            fontSize: '0.9rem',
                                            fontWeight: '700',
                                            background: '#0f172a',
                                            borderBottom: '1px solid rgba(34, 211, 238, 0.12)'
                                        }}>₹{order.amount.toLocaleString()}</td>
                                        <td style={{
                                            color: '#22d3ee',
                                            padding: '1.5rem 1rem',
                                            fontSize: '0.9rem',
                                            fontWeight: '500',
                                            background: '#0f172a',
                                            borderBottom: '1px solid rgba(34, 211, 238, 0.12)'
                                        }}>{order.paymentMethod}</td>
                                        <td style={{ padding: '1.5rem 0.5rem', borderBottom: '1px solid rgba(34, 211, 238, 0.12)', background: '#0f172a' }}>{getStatusBadge(order.status)}</td>
                                        <td style={{ padding: '1.5rem 1rem', borderBottom: '1px solid rgba(34, 211, 238, 0.12)', background: '#0f172a' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <Button
                                                    variant="outline-info"
                                                    size="sm"
                                                    onClick={() => handleViewOrder(order)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: '36px',
                                                        height: '36px',
                                                        padding: '0',
                                                        background: 'transparent',
                                                        borderColor: '#3b82f6',
                                                        color: '#3b82f6',
                                                        borderRadius: '8px',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = '#3b82f6';
                                                        e.currentTarget.style.color = '#fff';
                                                        e.currentTarget.style.transform = 'scale(1.1)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'transparent';
                                                        e.currentTarget.style.color = '#3b82f6';
                                                        e.currentTarget.style.transform = 'scale(1)';
                                                    }}
                                                >
                                                    <FaEye />
                                                </Button>
                                                <Button
                                                    variant="outline-warning"
                                                    size="sm"
                                                    onClick={() => handleEditClick(order)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: '36px',
                                                        height: '36px',
                                                        padding: '0',
                                                        background: 'transparent',
                                                        borderColor: '#fbbf24',
                                                        color: '#fbbf24',
                                                        borderRadius: '8px',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = '#fbbf24';
                                                        e.currentTarget.style.color = '#000';
                                                        e.currentTarget.style.transform = 'scale(1.1)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'transparent';
                                                        e.currentTarget.style.color = '#fbbf24';
                                                        e.currentTarget.style.transform = 'scale(1)';
                                                    }}
                                                >
                                                    <FaEdit />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', background: 'rgba(15, 23, 42, 0.4)' }}>
                                        No orders found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={handleCloseModal} centered size="xl" contentClassName="bg-transparent border-0 shadow-none">
                <div style={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    color: '#e2e8f0',
                    borderRadius: '24px',
                    border: '1px solid rgba(34, 211, 238, 0.2)',
                    backdropFilter: 'blur(20px)',
                    overflow: 'hidden',
                    width: '98vh',
                    height: '70vh',
                    margin: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(34, 211, 238, 0.1)'
                }}>
                    <Modal.Header closeButton closeVariant="white" style={{
                        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                        background: 'rgba(30, 41, 59, 0.4)'
                    }}>
                        <Modal.Title style={{
                            fontWeight: '800',
                            fontSize: '1.5rem',
                            letterSpacing: '1px',
                            color: '#22d3ee',
                            textShadow: '0 0 10px rgba(34, 211, 238, 0.3)'
                        }}>
                            ORDER PREVIEW
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ padding: '2rem', overflowY: 'auto' }}>
                        {selectedOrder && (
                            <Row>
                                <Col md={5}>
                                    <div style={{
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        background: '#1e293b',
                                        height: '250px',
                                        border: '1px solid rgba(148, 163, 184, 0.1)'
                                    }}>
                                        <img
                                            src={selectedOrder.image}
                                            alt={selectedOrder.product}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>
                                </Col>
                                <Col md={7}>
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h4 style={{ fontWeight: '700', marginBottom: '0.25rem' }}>{selectedOrder.product}</h4>
                                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                                Order ID: <span style={{ color: '#3b82f6', fontWeight: '600' }}>{selectedOrder.id}</span>
                                            </p>
                                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                                Customer: <span style={{ color: '#e2e8f0', fontWeight: '600' }}>{selectedOrder.customer}</span>
                                            </p>
                                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: 0 }}>
                                                Shipping Address: <span style={{ color: '#cbd5e1', fontWeight: '500', display: 'block', marginTop: '4px', lineHeight: '1.4' }}>{selectedOrder.address}</span>
                                            </p>
                                        </div>
                                        {getStatusBadge(selectedOrder.status)}
                                    </div>

                                    <hr style={{ borderColor: 'rgba(148, 163, 184, 0.1)', margin: '1.5rem 0' }} />

                                    <Row className="mb-3">
                                        <Col xs={6}>
                                            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Date</p>
                                            <p style={{ fontWeight: '500' }}>{selectedOrder.date}</p>
                                        </Col>
                                        <Col xs={6}>
                                            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Quantity</p>
                                            <p style={{ fontWeight: '500' }}>{selectedOrder.quantity} Units</p>
                                        </Col>
                                    </Row>

                                    <Row className="mb-4">
                                        <Col xs={6}>
                                            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Payment Method</p>
                                            <p style={{ fontWeight: '500' }}>{selectedOrder.paymentMethod}</p>
                                        </Col>
                                        <Col xs={6}>
                                            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Total Amount</p>
                                            <p style={{ color: '#22c55e', fontWeight: '700', fontSize: '1.25rem' }}>₹{selectedOrder.amount.toLocaleString()}</p>
                                        </Col>
                                    </Row>

                                    <Button
                                        variant="primary"
                                        className="w-100"
                                        onClick={handleCloseModal}
                                        style={{
                                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                            border: 'none',
                                            borderRadius: '12px',
                                            padding: '0.8rem',
                                            fontWeight: '700',
                                            letterSpacing: '0.5px',
                                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 6px 15px rgba(37, 99, 235, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                                        }}
                                    >
                                        CLOSE PREVIEW
                                    </Button>
                                </Col>
                            </Row>
                        )}
                    </Modal.Body>
                </div>
            </Modal>

            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered contentClassName="bg-transparent border-0 shadow-none">
                <div style={{
                    background: 'rgba(15, 23, 42, 0.98)',
                    color: '#e2e8f0',
                    borderRadius: '24px',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    backdropFilter: 'blur(25px)',
                    overflow: 'hidden',
                    width: '84vh',
                    height: '60vh',
                    margin: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 0 40px rgba(239, 68, 68, 0.05)'
                }}>
                    <Modal.Header closeVariant="white" style={{ borderBottom: 'none', padding: '1.5rem 1.5rem 0.5rem', textAlign: 'center', display: 'block' }}>
                        <div style={{ marginBottom: '1.5rem', marginTop: '3rem' }}>
                            <FaTrash style={{ fontSize: '3.5rem', color: '#ef4444', opacity: 0.8 }} />
                        </div>
                        <Modal.Title style={{ fontWeight: '800', fontSize: '1.75rem', color: '#ef4444', letterSpacing: '0.5px' }}>
                            CONFIRM DELETE
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ padding: '0.5rem 1.5rem 1.5rem' }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                            Are you sure you want to delete order <span style={{ color: '#e2e8f0', fontWeight: '600' }}>{orderToDelete}</span>? This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <Button
                                variant="outline-light"
                                className="flex-grow-1"
                                onClick={handleCloseDeleteModal}
                                style={{
                                    border: '1px solid rgba(148, 163, 184, 0.3)',
                                    borderRadius: '8px',
                                    padding: '0.6rem',
                                    fontWeight: '600',
                                    background: 'transparent'
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                className="flex-grow-1"
                                onClick={handleConfirmDelete}
                                style={{
                                    background: '#ef4444',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '0.6rem',
                                    fontWeight: '600'
                                }}
                            >
                                Delete
                            </Button>
                        </div>
                    </Modal.Body>
                </div>
            </Modal>

            <Modal show={showEditModal} onHide={handleCloseEditModal} centered contentClassName="bg-transparent border-0 shadow-none">
                <div style={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    color: '#e2e8f0',
                    borderRadius: '24px',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                    backdropFilter: 'blur(20px)',
                    overflow: 'hidden',
                    width: '84vh',
                    height: '60vh',
                    margin: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(251, 191, 36, 0.05)'
                }}>
                    <Modal.Header closeButton closeVariant="white" style={{
                        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                        padding: '1.5rem 2rem',
                        background: 'rgba(30, 41, 59, 0.4)'
                    }}>
                        <Modal.Title style={{
                            fontWeight: '800',
                            fontSize: '1.3rem',
                            letterSpacing: '1px',
                            color: '#fbbf24'
                        }}>
                            UPDATE STATUS
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ padding: '2.5rem 2rem' }}>
                        {orderToEdit && (
                            <>
                                <div className="mb-4">
                                    <label style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>
                                        ORDER ID: <span style={{ color: '#4b5563', fontWeight: '600' }}>{orderToEdit.id}</span>
                                    </label>
                                    <h5 style={{ color: '#f8fafc', fontWeight: '600', marginBottom: '1rem' }}>{orderToEdit.product}</h5>

                                    <Form.Group>
                                        <Form.Label style={{ color: '#22d3ee', fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.75rem', letterSpacing: '0.5px' }}>CHOOSE STATUS</Form.Label>
                                        <Form.Select
                                            value={newStatus}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                            style={{
                                                background: 'rgba(15, 23, 42, 0.6)',
                                                border: '1px solid rgba(34, 211, 238, 0.3)',
                                                borderRadius: '12px',
                                                color: '#c7d2fe',
                                                padding: '0.8rem',
                                                cursor: 'pointer',
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                boxShadow: 'inset 0 0 10px rgba(34, 211, 238, 0.05)'
                                            }}
                                        >
                                            <option value="pending" style={{ background: '#0f172a' }}>PENDING</option>
                                            <option value="shipped" style={{ background: '#0f172a' }}>SHIPPED</option>
                                            <option value="delivered" style={{ background: '#0f172a' }}>DELIVERED</option>
                                            <option value="return_accepted" style={{ background: '#0f172a' }}>RETURN ACCEPTED</option>
                                            <option value="returned" style={{ background: '#0f172a' }}>RETURNED</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <Button
                                        variant="outline-light"
                                        className="flex-grow-1"
                                        onClick={handleCloseEditModal}
                                        style={{
                                            border: '1px solid rgba(148, 163, 184, 0.3)',
                                            borderRadius: '8px',
                                            padding: '0.6rem',
                                            fontWeight: '600',
                                            background: 'transparent'
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="warning"
                                        className="flex-grow-1"
                                        onClick={handleUpdateStatus}
                                        style={{
                                            background: '#fbbf24',
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: '0.6rem',
                                            fontWeight: '600',
                                            color: '#000'
                                        }}
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </>
                        )}
                    </Modal.Body>
                </div>
            </Modal>
        </>
    );
};

export default SellerOrdersPage;
