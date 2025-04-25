import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Form, Input, Radio, Row, Col, Card, Divider, Space, Typography } from 'antd';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading/Loading';
import { removeFromCart } from '../../redux/slices/cartSlice';
import * as OrderService from '../../services/OrderService';
import * as VoucherService from '../../services/VoucherService';
import './Checkout.css';

const { Title, Text } = Typography;

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector((state) => state.user);
    const [form] = Form.useForm();
    const [isPending, setIsPending] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [shippingCost, setShippingCost] = useState(0);
    const [voucherCode, setVoucherCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [voucherId, setVoucherId] = useState(null); // Thêm state để lưu voucherId

    // Lấy danh sách sản phẩm được chọn từ location.state
    const selectedItems = location.state?.selectedItems || [];

    // Tính tổng tiền và phí vận chuyển
    useEffect(() => {
        if (selectedItems.length === 0) {
            toast.warning('Không có sản phẩm nào được chọn!');
            navigate('/cart');
            return;
        }

        const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shipping = subtotal >= 500000 ? 0 : 30000;
        setShippingCost(shipping);
        setTotalPrice(subtotal + shipping - discount);
    }, [selectedItems, navigate, discount]);

    // Điền thông tin người dùng nếu đã đăng nhập
    useEffect(() => {
        if (user?.id) {
            form.setFieldsValue({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
            });
        }
    }, [user, form]);

    // Xử lý áp dụng mã giảm giá
    const handleApplyVoucher = async () => {
        if (!voucherCode) {
            toast.warning('Vui lòng nhập mã giảm giá!');
            return;
        }
        setIsPending(true);
        try {
            const response = await VoucherService.applyVoucher(voucherCode, user?.access_token);
            if (response.status === 'success') {
                toast.success(response.message);
                const discountValue = totalPrice * (response.data.percent / 100);
                setDiscount(discountValue);
                setVoucherId(response.data.voucherId); // Lưu voucherId từ response
            }
        } catch (error) {
            const serverResponse = error.response?.data;
            toast.error(serverResponse.message);
            setDiscount(0);
            setVoucherId(null);
        } finally {
            setIsPending(false);
        }
    };

    // Xử lý khi nhấn "Hoàn tất đơn hàng"
    const handleFinish = async (values) => {
        if (selectedItems.length === 0) {
            toast.error('Không có sản phẩm nào được chọn!');
            return;
        }

        if (!user?.id || !user?.access_token) {
            toast.error('Vui lòng đăng nhập để đặt hàng!');
            navigate('/sign-in');
            return;
        }

        setIsPending(true);
        try {
            const orderData = {
                user: user.id,
                orderItems: selectedItems.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    image: item.image,
                    price: item.price,
                    product: item.id,
                })),
                shippingAddress: {
                    name: values.name,
                    address: values.address,
                    phone: values.phone,
                    city: values.city,
                    location: { latitude: 0, longitude: 0 },
                },
                shippingCost: shippingCost,
                totalPrice: totalPrice,
                paymentMethod: values.paymentMethod,
                voucherId: voucherId, // Sử dụng voucherId từ state
            };

            console.log('Order data:', orderData); // Debug log
            const response = await OrderService.createOrder(orderData, user.access_token);
            console.log('Create order response:', response); // Debug log
            if (response.status === 'success') {
                toast.success('Đặt hàng thành công!');
                selectedItems.forEach(item => {
                    dispatch(removeFromCart(item.id));
                });
                navigate('/my-order', { replace: true });
            } else {
                toast.error(response.message || 'Có lỗi xảy ra khi đặt hàng!');
            }
        } catch (error) {
            console.error('Create order error:', error); // Debug log
            toast.error('Có lỗi xảy ra: ' + error.message);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Row gutter={[16, 16]}>
                {/* Cột bên trái: Thông tin giao hàng và phương thức thanh toán */}
                <Col span={16}>
                    <Card title="Thông tin giao hàng" bordered>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleFinish}
                            initialValues={{
                                paymentMethod: 'COD',
                                city: 'Cần Thơ',
                            }}
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Họ và tên"
                                        name="name"
                                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                                    >
                                        <Input placeholder="Nhập họ và tên" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
                                    >
                                        <Input placeholder="Nhập email" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Số điện thoại"
                                        name="phone"
                                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                                    >
                                        <Input placeholder="Nhập số điện thoại" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Địa chỉ"
                                        name="address"
                                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                                    >
                                        <Input placeholder="Nhập địa chỉ" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                label="Tỉnh/Thành"
                                name="city"
                                rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành!' }]}
                            >
                                <Input placeholder="Chọn tỉnh/thành" />
                            </Form.Item>

                            <Divider />

                            <Title level={4}>Phương thức thanh toán</Title>
                            <Form.Item
                                name="paymentMethod"
                                rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
                            >
                                <Radio.Group>
                                    <Space direction="vertical">
                                        <Radio value="COD">Thanh toán khi giao hàng (COD)</Radio>
                                        <Radio value="BankTransfer">Chuyển khoản qua ngân hàng</Radio>
                                        <Radio value="MoMo">MoMo</Radio>
                                    </Space>
                                </Radio.Group>
                            </Form.Item>

                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', fontSize: '17px' }}
                                disabled={isPending}
                            >
                                Đặt hàng
                            </Button>
                        </Form>
                    </Card>
                </Col>

                {/* Cột bên phải: Thông tin đơn hàng */}
                <Col span={8}>
                    <Card title="Thông tin đơn hàng" bordered>
                        {selectedItems.map(item => (
                            <div key={item.id} style={{ display: 'flex', marginBottom: '10px' }}>
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    style={{ width: '50px', height: '50px', marginRight: '10px' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <Text strong>{item.name}</Text>
                                    <div>
                                        <Text>Số lượng: {item.quantity}</Text>
                                    </div>
                                </div>
                                <Text style={{ color: 'red' }}>
                                    {(item.price * item.quantity).toLocaleString()} ₫
                                </Text>
                            </div>
                        ))}

                        <Divider />

                        <Row justify="space-between">
                            <Col>Mã giảm giá</Col>
                            <Col>
                                <Space>
                                    <Input
                                        placeholder="Nhập mã giảm giá"
                                        value={voucherCode}
                                        onChange={(e) => setVoucherCode(e.target.value)}
                                        style={{ width: '150px' }}
                                    />
                                    <Button onClick={handleApplyVoucher} disabled={isPending}>Sử dụng</Button>
                                </Space>
                            </Col>
                        </Row>

                        <Divider />

                        <Row justify="space-between">
                            <Col>Tạm tính</Col>
                            <Col>
                                {selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()} ₫
                            </Col>
                        </Row>
                        <Row justify="space-between" style={{ marginTop: '10px' }}>
                            <Col>Phí vận chuyển</Col>
                            <Col>{shippingCost.toLocaleString()} ₫</Col>
                        </Row>
                        {discount > 0 && (
                            <Row justify="space-between" style={{ marginTop: '10px' }}>
                                <Col>Giảm giá</Col>
                                <Col>-{discount.toLocaleString()} ₫</Col>
                            </Row>
                        )}

                        <Divider />

                        <Row justify="space-between" style={{ fontWeight: 'bold' }}>
                            <Col>Tổng cộng</Col>
                            <Col style={{ color: 'red' }}>
                                VND {totalPrice.toLocaleString()} ₫
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
            <Loading isPending={isPending} />
        </div>
    );
};

export default Checkout;