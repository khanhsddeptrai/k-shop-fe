import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Divider, Typography, Button, Result } from 'antd';
import { toast } from 'react-toastify';
import * as OrderService from '../../services/OrderService';
import Loading from '../../components/Loading/Loading';

const { Title, Text } = Typography;

// Cấu hình trạng thái
const STATUS_CONFIG = {
    pending: { color: 'orange', label: 'Đang chờ' },
    confirmed: { color: 'blue', label: 'Đã xác nhận' },
    delivered: { color: 'green', label: 'Đã giao hàng' },
    cancelled: { color: 'red', label: 'Đã hủy đơn' },
    default: { color: 'default', label: 'Không xác định' },
};

// Component hiển thị sản phẩm
const OrderItem = ({ item }) => (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', padding: '10px', borderBottom: '1px solid #f0f0f0' }}>
        <img
            src={item.image || 'https://via.placeholder.com/80'}
            alt={item.name || 'Sản phẩm'}
            style={{ width: '80px', height: '80px', marginRight: '15px', objectFit: 'cover', borderRadius: '4px' }}
        />
        <div style={{ flex: 1 }}>
            <Text strong style={{ fontSize: '16px' }}>{item.name || 'Không có tên'}</Text>
            <div>
                <Text>
                    Số lượng: {item.quantity || 0} x {(item.price || 0).toLocaleString()} ₫
                </Text>
            </div>
            <Text strong>Tổng: {((item.quantity || 0) * (item.price || 0)).toLocaleString()} ₫</Text>
        </div>
    </div>
);

// Component hiển thị thông tin giao hàng
const ShippingInfo = ({ shippingAddress, paymentMethod, shippingCost, totalPrice }) => (
    <>
        <Title level={4}>Thông tin giao hàng</Title>
        <Text strong>Người nhận: </Text>
        <Text>{shippingAddress?.name || 'Không có thông tin'}</Text>
        <br />
        <Text strong>Địa chỉ: </Text>
        <Text>{shippingAddress?.address ? `${shippingAddress.address}, ${shippingAddress.city || ''}` : 'Không có thông tin'}</Text>
        <br />
        <Text strong>Số điện thoại: </Text>
        <Text>{shippingAddress?.phone || 'Không có thông tin'}</Text>
        <Divider />
        <Title level={4}>Phương thức thanh toán</Title>
        <Text>{paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : paymentMethod || 'Không có thông tin'}</Text>
        <Divider />
        <Title level={4}>Tổng cộng</Title>
        <Text strong>Phí vận chuyển: </Text>
        <Text>{(shippingCost || 0).toLocaleString()} ₫</Text>
        <br />
        <Text strong>Tổng tiền: </Text>
        <Text style={{ color: 'red', fontSize: '18px' }}>{(totalPrice || 0).toLocaleString()} ₫</Text>
    </>
);

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        if (!id) {
            setError('ID đơn hàng không hợp lệ');
            setIsLoading(false);
            setIsCheckingAuth(false);
            return;
        }
        const storageToken = localStorage.getItem('access_token');
        if (!user?.id && !storageToken) {
            toast.warning('Vui lòng đăng nhập để xem chi tiết đơn hàng!');
            navigate('/sign-in');
            setIsLoading(false);
            setIsCheckingAuth(false);
            return;
        }
        if (!user?.id) {
            return; // Đợi Redux store khởi tạo
        }
        setIsCheckingAuth(false);
        const fetchOrderDetail = async () => {
            setIsLoading(true);
            try {
                console.log('Gọi API với token:', user.access_token || storageToken);
                const response = await OrderService.getOrderDetail(id, user.access_token || storageToken);
                console.log('Phản hồi API:', response);
                if (response.status === 'success' && response.data) {
                    setOrder(response.data);
                } else {
                    setError(response.message || 'Không thể lấy thông tin đơn hàng!');
                }
            } catch (error) {
                console.error('Lỗi API:', error);
                if (error.response?.status === 401) {
                    toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!');
                    navigate('/sign-in');
                } else {
                    setError(error.response?.data?.message || error.message || 'Đã có lỗi xảy ra');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderDetail();
    }, [id, user, navigate]);

    const renderStatusTag = (status) => {
        const { color, label } = STATUS_CONFIG[status] || STATUS_CONFIG.default;
        return <span style={{ color, fontWeight: 'bold' }}>{label}</span>;
    };

    // Hiển thị lỗi
    if (error) {
        return (
            <Result
                status="error"
                title="Lỗi"
                subTitle={error}
                extra={<Button type="primary" onClick={() => navigate('/my-order')}>Quay lại danh sách đơn hàng</Button>}
            />
        );
    }

    // Hiển thị loading khi đợi auth hoặc dữ liệu
    if (isLoading || isCheckingAuth) {
        return <Loading isPending={true} />;
    }

    // Kiểm tra đơn hàng
    if (!order || !order._id) {
        return (
            <Result
                status="404"
                title="Không tìm thấy"
                subTitle="Đơn hàng không tồn tại hoặc không có dữ liệu hợp lệ."
                extra={<Button type="primary" onClick={() => navigate('/my-order')}>Quay lại danh sách đơn hàng</Button>}
            />
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <Title level={2}>Chi tiết đơn hàng #{order._id}</Title>
            <Card
                title={
                    <span> Trạng thái: {renderStatusTag(order.status)}</span>
                }
                bordered
                style={{ marginBottom: '16px' }}
            >
                <Row gutter={[16, 16]}>
                    <Col span={16}>
                        <Title level={4}>Sản phẩm</Title>
                        {order.orderItems?.length > 0 ? (
                            order.orderItems.map((item) => <OrderItem key={item._id || Math.random()} item={item} />)
                        ) : (
                            <Text>Không có sản phẩm trong đơn hàng.</Text>
                        )}
                    </Col>
                    <Col span={8}>
                        <ShippingInfo
                            shippingAddress={order.shippingAddress}
                            paymentMethod={order.paymentMethod}
                            shippingCost={order.shippingCost}
                            totalPrice={order.totalPrice}
                        />
                    </Col>
                </Row>
            </Card>
            <Button type="primary" onClick={() => navigate('/my-order')}>
                Quay lại danh sách đơn hàng
            </Button>
        </div>
    );
};

export default OrderDetail;