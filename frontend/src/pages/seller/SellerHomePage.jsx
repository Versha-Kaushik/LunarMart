import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, Row, Col } from 'react-bootstrap';
import { FaBox, FaShoppingCart, FaDollarSign, FaClock } from 'react-icons/fa';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { useGetProductsQuery } from '../../slices/productsApiSlice';
import { useGetSellerOrdersQuery } from '../../slices/ordersApiSlice';
import Meta from '../../components/Meta';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const SellerHomePage = () => {
    const { userInfo } = useSelector((state) => state.auth);

    const { data: productsData, isLoading: loadingProducts, error: productsError } = useGetProductsQuery({
        userId: userInfo?._id,
    });

    const { data: ordersData, isLoading: loadingOrders, error: ordersError } = useGetSellerOrdersQuery(undefined, {
        pollingInterval: 5000,
    });

    const [stats, setStats] = useState({
        totalProducts: 0,
        pendingOrders: 0,
        ordersThisMonth: 0,
        totalRevenue: 0,
    });

    const [categoryData, setCategoryData] = useState([]);

    const COLORS = ['#9333ea', '#3b82f6', '#22c55e', '#fbbf24', '#f43f5e', '#ec4899'];

    const [salesData, setSalesData] = useState([]);

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const RADIAN = Math.PI / 180;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="12px"
                fontWeight="700"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    useEffect(() => {
        if (productsData && productsData.products) {
            const products = productsData.products.filter(p => p.name !== 'Vanilla Bean Jar Candle');

            setStats((prev) => ({
                ...prev,
                totalProducts: products.length,
            }));

            const dist = products.reduce((acc, product) => {
                const cat = product.category || 'Uncategorized';
                acc[cat] = (acc[cat] || 0) + 1;
                return acc;
            }, {});

            const formattedData = Object.keys(dist).map((name) => ({
                name,
                value: dist[name],
            }));

            setCategoryData(formattedData);
        }
    }, [productsData]);

    useEffect(() => {
        if (ordersData) {
            const allItems = ordersData.filter(order => order._id !== '69906ed8d8714a02130fb77d').flatMap(order =>
                order.orderItems.map(item => ({
                    status: item.status || (order.isDelivered ? 'delivered' : (order.isPaid ? 'shipped' : 'pending')),
                    price: item.price,
                    qty: item.qty,
                    createdAt: new Date(order.createdAt)
                }))
            );

            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonthIndex = now.getMonth();

            const performance = months
                .slice(0, currentMonthIndex + 1)
                .map((month, index) => {
                    const monthSales = allItems
                        .filter(item => item.createdAt.getMonth() === index && item.createdAt.getFullYear() === currentYear)
                        .reduce((acc, item) => acc + (item.price * item.qty), 0);

                    return { month, sales: monthSales };
                });

            setSalesData(performance);

            const pending = allItems.filter(item => item.status === 'pending').length;

            const thisMonth = allItems.filter(item =>
                item.createdAt.getMonth() === now.getMonth() &&
                item.createdAt.getFullYear() === now.getFullYear()
            ).length;

            const revenue = allItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

            setStats(prev => ({
                ...prev,
                pendingOrders: pending,
                ordersThisMonth: thisMonth,
                totalRevenue: revenue
            }));
        }
    }, [ordersData]);

    if (loadingProducts || loadingOrders) return <Loader />;
    if (productsError || ordersError) return <Message variant="danger">
        {productsError?.data?.message || ordersError?.data?.message || 'Failed to load dashboard data'}
    </Message>;

    return (
        <div className="product-page-container py-4">
            <Meta title="Seller Dashboard - Home" />

            <h2 style={{ color: '#e2e8f0', fontWeight: '700', marginBottom: '2rem', marginLeft: '2rem' }}>
                Dashboard Overview
            </h2>

            <Row className="mb-4" style={{ marginLeft: '1.5rem', marginRight: '1.5rem' }}>
                <Col md={3} className="mb-3">
                    <Card style={{
                        background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(147, 51, 234, 0.05) 100%)',
                        border: '1px solid rgba(147, 51, 234, 0.3)',
                        borderRadius: '12px'
                    }}>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Total Products</p>
                                    <h3 style={{ color: '#9333ea', fontWeight: '700', margin: '0.5rem 0 0 0' }}>
                                        {stats.totalProducts}
                                    </h3>
                                </div>
                                <FaBox size={40} color="#9333ea" opacity={0.5} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3} className="mb-3">
                    <Card style={{
                        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(251, 191, 36, 0.05) 100%)',
                        border: '1px solid rgba(251, 191, 36, 0.3)',
                        borderRadius: '12px'
                    }}>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Pending Orders</p>
                                    <h3 style={{ color: '#fbbf24', fontWeight: '700', margin: '0.5rem 0 0 0' }}>
                                        {stats.pendingOrders}
                                    </h3>
                                </div>
                                <FaClock size={40} color="#fbbf24" opacity={0.5} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3} className="mb-3">
                    <Card style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.05) 100%)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '12px'
                    }}>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Orders This Month</p>
                                    <h3 style={{ color: '#3b82f6', fontWeight: '700', margin: '0.5rem 0 0 0' }}>
                                        {stats.ordersThisMonth}
                                    </h3>
                                </div>
                                <FaShoppingCart size={40} color="#3b82f6" opacity={0.5} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3} className="mb-3">
                    <Card style={{
                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.05) 100%)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        borderRadius: '12px'
                    }}>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Total Revenue</p>
                                    <h3 style={{ color: '#22c55e', fontWeight: '700', margin: '0.5rem 0 0 0' }}>
                                        ₹{stats.totalRevenue.toLocaleString()}
                                    </h3>
                                </div>
                                <FaDollarSign size={40} color="#22c55e" opacity={0.5} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-4" style={{ marginLeft: '1.5rem', marginRight: '1.5rem' }}>
                <Col lg={12} className="mb-4">
                    <Card style={{
                        background: 'rgba(15, 23, 42, 0.5)',
                        border: '1px solid rgba(148, 163, 184, 0.1)',
                        borderRadius: '16px',
                        padding: '1.5rem'
                    }}>
                        <h4 style={{ color: '#e2e8f0', fontWeight: '600', marginBottom: '1.5rem' }}>Sales Performance (Year-to-Date)</h4>
                        <div style={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer>
                                <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        tickFormatter={(value) => `₹${value / 1000}k`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: '#1e293b',
                                            border: '1px solid rgba(148, 163, 184, 0.2)',
                                            borderRadius: '8px',
                                            color: '#e2e8f0'
                                        }}
                                        itemStyle={{ color: '#9333ea' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="sales"
                                        stroke="#9333ea"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorSales)"
                                        isAnimationActive={true}
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row style={{ marginLeft: '1.5rem', marginRight: '1.5rem' }}>
                <Col lg={12} className="mb-4">
                    <Card style={{
                        background: 'rgba(15, 23, 42, 0.5)',
                        border: '1px solid rgba(148, 163, 184, 0.1)',
                        borderRadius: '16px',
                        padding: '1.5rem'
                    }}>
                        <h4 style={{ color: '#e2e8f0', fontWeight: '600', marginBottom: '1.5rem' }}>Category Distribution</h4>
                        <div style={{ width: '100%', height: 400 }}>
                            {categoryData.length > 0 ? (
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={120}
                                            paddingAngle={5}
                                            dataKey="value"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            isAnimationActive={true}
                                            animationDuration={1500}
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                background: '#1e293b',
                                                border: '1px solid rgba(148, 163, 184, 0.2)',
                                                borderRadius: '8px',
                                                color: '#e2e8f0'
                                            }}
                                        />
                                        <Legend
                                            verticalAlign="bottom"
                                            height={36}
                                            formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '12px' }}>{value}</span>}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className='h-100 d-flex flex-column align-items-center justify-content-center text-center'>
                                    <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>📦</div>
                                    <h5 style={{ color: '#94a3b8', fontWeight: '500' }}>No categories added yet</h5>
                                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Add some products to see your distribution!</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SellerHomePage;
