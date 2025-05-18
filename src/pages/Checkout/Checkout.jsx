import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Form, Input, Radio, Row, Col, Card, Divider, Space, Typography } from 'antd';
import { toast } from 'react-toastify';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
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
    const [voucherId, setVoucherId] = useState(null);
    const [paypalOrderId, setPaypalOrderId] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('COD'); // Thêm trạng thái để theo dõi phương thức thanh toán

    const selectedItems = location.state?.selectedItems || [];

    useEffect(() => {
        console.log('selectedItems:', selectedItems);
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

    useEffect(() => {
        console.log('user:', user);
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

    useEffect(() => {
        setIsPending(false); // Reset isPending khi component mount
    }, []);

    const handleApplyVoucher = async () => {
        console.log('handleApplyVoucher called with voucherCode:', voucherCode);
        if (!voucherCode) {
            toast.warning('Vui lòng nhập mã giảm giá!');
            return;
        }
        setIsPending(true);
        try {
            const response = await VoucherService.applyVoucher(voucherCode, user?.access_token);
            console.log('Voucher response:', response);
            if (response.status === 'success') {
                toast.success(response.message);
                const discountValue = totalPrice * (response.data.percent / 100);
                setDiscount(discountValue);
                setVoucherId(response.data.voucherId);
            }
        } catch (error) {
            const serverResponse = error.response?.data;
            console.error('Voucher error:', serverResponse);
            toast.error(serverResponse.message);
            setDiscount(0);
            setVoucherId(null);
        } finally {
            setIsPending(false);
        }
    };

    const createPaypalOrder = async () => {
        console.log('createPaypalOrder called');
        console.log('Access token:', user.access_token);
        console.log('selectedItems:', selectedItems);
        console.log('totalPrice:', totalPrice);
        if (!user?.id || !user?.access_token) {
            console.log('User not logged in');
            toast.error('Vui lòng đăng nhập để thanh toán!');
            navigate('/sign-in');
            return;
        }

        setIsPending(true);
        try {
            const orderId = `ORDER-${Date.now()}`;
            console.log('Creating PayPal order with data:', { items: selectedItems, totalPrice, orderId });
            const response = await axios.post(
                `${process.env.REACT_APP_URL_BACKEND}/paypal/create-order`,
                {
                    items: selectedItems,
                    totalPrice,
                    orderId,
                },
                {
                    headers: { token: `Bearer ${user.access_token}` },
                }
            );

            console.log('PayPal create-order response:', response.data);
            setPaypalOrderId(response.data.orderId);
            return response.data.orderId;
        } catch (error) {
            console.error('PayPal create order error:', error.response?.data || error.message);
            toast.error('Lỗi khi tạo đơn hàng PayPal!');
            setIsPending(false);
            throw error;
        }
    };

    const onApprovePaypal = async (data, actions) => {
        console.log('onApprovePaypal called with data:', data);
        setIsPending(true);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_URL_BACKEND}/paypal/capture-order`,
                { orderId: data.orderID },
                {
                    headers: { token: `Bearer ${user.access_token}` },
                }
            );

            console.log('PayPal capture-order response:', response.data);
            if (response.data.status === 'success') {
                toast.success('Thanh toán PayPal thành công!');
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
                        name: form.getFieldValue('name'),
                        address: form.getFieldValue('address'),
                        phone: form.getFieldValue('phone'),
                        city: form.getFieldValue('city'),
                        location: { latitude: 0, longitude: 0 },
                    },
                    shippingCost: shippingCost,
                    totalPrice: totalPrice,
                    paymentMethod: 'PayPal',
                    voucherId: voucherId,
                    paymentStatus: 'PAID',
                    isPaid: true,
                    paidAt: new Date(),
                };

                console.log('Order data for PayPal:', orderData);
                const orderResponse = await OrderService.createOrder(orderData, user.access_token);
                console.log('Create order response after PayPal:', orderResponse);
                if (orderResponse.status === 'success') {
                    selectedItems.forEach(item => {
                        dispatch(removeFromCart(item.id));
                    });
                    navigate('/my-order', { replace: true });
                } else {
                    toast.error(orderResponse.message || 'Lỗi khi tạo đơn hàng!');
                }
            } else {
                toast.error('Thanh toán PayPal không thành công!');
            }
        } catch (error) {
            console.error('PayPal capture error:', error.response?.data || error.message);
            toast.error('Lỗi khi xác nhận thanh toán!');
        } finally {
            setIsPending(false);
        }
    };

    const handleFinish = async (values) => {
        console.log('handleFinish called with values:', values);
        if (selectedItems.length === 0) {
            console.log('No selected items');
            toast.error('Không có sản phẩm nào được chọn!');
            return;
        }

        if (!user?.id || !user?.access_token) {
            console.log('User not logged in');
            toast.error('Vui lòng đăng nhập để đặt hàng!');
            navigate('/sign-in');
            return;
        }

        if (values.paymentMethod === 'PayPal') {
            console.log('PayPal selected, skipping handleFinish');
            toast.info('Vui lòng sử dụng nút PayPal để thanh toán!');
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
                voucherId: voucherId,
                paymentStatus: 'PENDING',
            };

            console.log('Order data to send:', orderData);
            const response = await OrderService.createOrder(orderData, user.access_token);
            console.log('Create order response:', response);

            if (response.status === 'success') {
                console.log('Order created successfully');
                toast.success('Đặt hàng thành công!');
                selectedItems.forEach(item => {
                    dispatch(removeFromCart(item.id));
                });
                navigate('/my-order', { replace: true });
            } else {
                console.log('Order creation failed:', response.message);
                toast.error(response.message || 'Có lỗi xảy ra khi đặt hàng!');
            }
        } catch (error) {
            console.error('Create order error:', error);
            toast.error('Có lỗi xảy ra: ' + error.message);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <PayPalScriptProvider
                options={{
                    clientId: 'AV4f-CS8wNYzUhhfpVNkWPHSE234ZnduCTXn9OCiGyAXeK2NGHBle0DjQ_j3a1CcWa0C-QnmNWPGNv37',
                    currency: 'USD'
                }}
            >
                <Row gutter={[16, 16]}>
                    <Col span={16}>
                        <Card title="Thông tin giao hàng" bordered>
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleFinish}
                                initialValues={{
                                    paymentMethod: 'COD',
                                    city: 'Cần Thơ',
                                    name: user.name || 'Tên mặc định',
                                    email: user.email || 'email@example.com',
                                    phone: user.phone || '0123456789',
                                    address: user.address || 'Địa chỉ mặc định',
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
                                    <Radio.Group
                                        onChange={(e) => {
                                            console.log('Payment method changed:', e.target.value);
                                            setSelectedPaymentMethod(e.target.value); // Cập nhật trạng thái
                                        }}
                                        value={selectedPaymentMethod}
                                    >
                                        <Space direction="vertical">
                                            <Radio value="COD">Thanh toán khi giao hàng (COD)</Radio>
                                            <Radio value="PayPal">PayPal</Radio>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>

                                {console.log('isPending:', isPending)}
                                {console.log('Selected payment method:', selectedPaymentMethod)}
                                {selectedPaymentMethod === 'PayPal' && (
                                    <div>
                                        <p>Nhấn vào nút PayPal bên dưới để thanh toán:</p>
                                        <PayPalButtons
                                            style={{ layout: 'vertical' }}
                                            disabled={isPending}
                                            createOrder={createPaypalOrder}
                                            onApprove={onApprovePaypal}
                                            onError={(err) => {
                                                console.error('PayPalButtons error:', err);
                                                toast.error('Lỗi khi xử lý thanh toán PayPal!');
                                                setIsPending(false);
                                            }}
                                            onCancel={(data) => {
                                                console.log('PayPal payment canceled with data:', data);
                                                toast.info('Thanh toán đã bị hủy!');
                                                setIsPending(false);
                                            }}
                                        />
                                    </div>
                                )}

                                {selectedPaymentMethod !== 'PayPal' && (
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        block
                                        style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', fontSize: '17px' }}
                                        disabled={isPending}
                                    >
                                        Đặt hàng
                                    </Button>
                                )}
                            </Form>
                        </Card>
                    </Col>

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
            </PayPalScriptProvider>
        </div>
    );
};

export default Checkout;