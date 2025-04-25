import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Divider, Typography, Button, Empty, Tag } from 'antd';
import { toast } from 'react-toastify';
import * as OrderService from '../../services/OrderService';
import './MyOrder.css';
import Loading from '../../components/Loading/Loading';

const { Title, Text } = Typography;

const MyOrder = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Bắt đầu với loading

    useEffect(() => {
        if (!user?.id) {
            // Đợi user.id hoặc kiểm tra xem có token không
            const storageData = localStorage.getItem('access_token');
            if (!storageData) {
                toast.warning('Vui lòng đăng nhập để xem đơn hàng!');
                navigate('/sign-in');
                setIsLoading(false);
            }
            return;
        }

        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                const response = await OrderService.getMyorders(user.id, user?.access_token);
                if (response.status === 'success') {
                    setOrders(response.data || []);
                } else {
                    toast.error(response.message || 'Không thể lấy danh sách đơn hàng!');
                    setOrders([]);
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.message || 'Đã có lỗi xảy ra';
                toast.error(errorMessage);
                setOrders([]); // Đặt orders rỗng để hiển thị Empty
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [user.id, user.access_token, navigate]);

    const renderStatusTag = (status) => {
        let color = 'default';
        let label = status;
        switch (status) {
            case 'pending':
                color = 'orange';
                label = 'Đang chờ';
                break;
            case 'confirmed':
                color = 'blue';
                label = 'Đã xác nhận';
                break;
            case 'delivered':
                color = 'green';
                label = 'Đã giao hàng';
                break;
            case 'cancelled':
                color = 'red';
                label = 'Đã hủy đơn';
                break;
            default:
                color = 'default';
        }
        return <Tag color={color}>{label}</Tag>;
    };

    const handleViewOrderDetail = (orderId) => {
        navigate(`/detail/${orderId}`);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <Title level={2}>Đơn hàng của tôi</Title>
            {isLoading ? (
                <Loading isPending={isLoading} />
            ) : orders.length === 0 ? (
                <Empty description="Bạn chưa có đơn hàng nào!" style={{ marginTop: '50px' }}>
                    <Button type="primary" onClick={() => navigate('/products')}>
                        Mua sắm ngay
                    </Button>
                </Empty>
            ) : (
                <Row gutter={[16, 16]}>
                    {orders.map((order) => (
                        <Col span={24} key={order._id}>
                            <Card
                                title={`Mã đơn hàng: ${order._id}`}
                                extra={renderStatusTag(order.status)}
                                bordered
                                style={{ marginBottom: '16px' }}
                                actions={[
                                    <Button
                                        type="link"
                                        onClick={() => handleViewOrderDetail(order._id)}
                                    >
                                        Xem chi tiết
                                    </Button>,
                                ]}
                            >
                                <Row gutter={[16, 16]}>
                                    <Col span={16}>
                                        {order.orderItems.map((item) => (
                                            <div
                                                key={item._id}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    marginBottom: '10px',
                                                }}
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    style={{
                                                        width: '60px',
                                                        height: '60px',
                                                        marginRight: '10px',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                                <div style={{ flex: 1 }}>
                                                    <Text strong>{item.name}</Text>
                                                    <div>
                                                        <Text>
                                                            Số lượng: {item.quantity} x{' '}
                                                            {item.price.toLocaleString()} ₫
                                                        </Text>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </Col>
                                    <Col span={8}>
                                        <Text strong>Thông tin giao hàng:</Text>
                                        <div style={{ marginTop: '8px' }}>
                                            <Text>
                                                Người nhận: {order.shippingAddress.name}
                                                <br />
                                                Địa chỉ: {order.shippingAddress.address},{' '}
                                                {order.shippingAddress.city}
                                                <br />
                                                Số điện thoại: {order.shippingAddress.phone}
                                            </Text>
                                        </div>
                                        <Divider />
                                        <Text strong>Phương thức thanh toán:</Text>
                                        <div>
                                            <Text>
                                                {order.paymentMethod === 'COD'
                                                    ? 'Thanh toán khi nhận hàng'
                                                    : order.paymentMethod}
                                            </Text>
                                        </div>
                                        <Divider />
                                        <Text strong>Tổng tiền:</Text>
                                        <div>
                                            <Text style={{ color: 'red', fontSize: '16px' }}>
                                                {order.totalPrice.toLocaleString()} ₫
                                            </Text>
                                        </div>
                                        {order.shippingCost > 0 && (
                                            <div>
                                                <Text>
                                                    (Bao gồm {order.shippingCost.toLocaleString()} ₫
                                                    phí vận chuyển)
                                                </Text>
                                            </div>
                                        )}
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default MyOrder;