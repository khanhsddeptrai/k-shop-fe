import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Row, Col, Checkbox } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading/Loading';
import { updateCartQuantity, removeFromCart, clearCart } from '../../redux/slices/cartSlice';
import './Cart.css';
import { WrapperInputQuantity } from './style';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector(state => state.cart);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const user = useSelector((state) => state.user);


    // Tính tổng tiền dựa trên các sản phẩm được chọn
    useEffect(() => {
        const selectedItems = cartItems.filter(item => selectedRowKeys.includes(item.id));
        const total = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalPrice(total);
    }, [selectedRowKeys, cartItems]);

    // Xử lý chọn tất cả hoặc bỏ chọn tất cả
    const handleSelectAll = (checked) => {
        if (checked) {
            const allKeys = cartItems.map(item => item.id);
            setSelectedRowKeys(allKeys);
        } else {
            setSelectedRowKeys([]);
        }
    };

    // Xử lý tăng/giảm số lượng
    const handleQuantityChange = (id, value) => {
        if (value >= 1) {
            dispatch(updateCartQuantity({ id, quantity: value }));
        }
    };

    // Xử lý xóa sản phẩm
    const handleRemoveItem = (id) => {
        dispatch(removeFromCart(id));
        toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
        setSelectedRowKeys(selectedRowKeys.filter(key => key !== id));
    };

    // Xử lý xóa nhiều sản phẩm
    const handleRemoveSelected = () => {
        if (selectedRowKeys.length === 0) {
            toast.warning('Vui lòng chọn ít nhất một sản phẩm để xóa!');
            return;
        }
        selectedRowKeys.forEach(id => {
            dispatch(removeFromCart(id));
        });
        toast.success('Đã xóa các sản phẩm được chọn khỏi giỏ hàng');
        setSelectedRowKeys([]);
    };

    // Xử lý thanh toán
    const handleCheckout = () => {
        if (!user.access_token) {
            toast.error('Vui lòng đăng nhập để mua hàng!');
            navigate('/sign-in');
            return;

        }
        if (selectedRowKeys.length === 0) {
            toast.warning('Vui lòng chọn ít nhất một sản phẩm để đặt hàng!');
            return;
        }
        const selectedItems = cartItems.filter(item => selectedRowKeys.includes(item.id));
        navigate('/checkout', { state: { selectedItems } });
    };

    // Cột của bảng giỏ hàng
    const columns = [
        {
            title: (
                <Checkbox
                    checked={selectedRowKeys.length === cartItems.length && cartItems.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    disabled={cartItems.length === 0}
                />
            ),
            dataIndex: 'select',
            width: '5%',
            render: (_, record) => (
                <Checkbox
                    checked={selectedRowKeys.includes(record.id)}
                    onChange={(e) => {
                        const newKeys = e.target.checked
                            ? [...selectedRowKeys, record.id]
                            : selectedRowKeys.filter(key => key !== record.id);
                        setSelectedRowKeys(newKeys);
                    }}
                />
            ),
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'name',
            width: '30%',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={record.image} alt={text} style={{ width: '50px', marginRight: '10px' }} />
                    <span>{text}</span>
                </div>
            ),
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            width: '15%',
            render: (price) => `${price.toLocaleString()} ₫`,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            width: '20%',
            render: (quantity, record) => (
                <div>
                    <Button onClick={() => handleQuantityChange(record.id, quantity - 1)}>-</Button>
                    <WrapperInputQuantity min={1} value={quantity} disabled />
                    <Button onClick={() => handleQuantityChange(record.id, quantity + 1)}>+</Button>
                </div>
            ),
        },
        {
            title: 'Thành tiền',
            dataIndex: 'total',
            width: '15%',
            render: (_, record) => (
                <span style={{ color: 'red' }}>
                    {(record.price * record.quantity).toLocaleString()} ₫
                </span>
            ),
        },
        {
            title: 'Xóa',
            dataIndex: 'action',
            width: '12%',
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveItem(record.id)}
                    title="Xóa"
                    style={{ color: '#000' }}
                />
            ),
        },
    ];

    // Dữ liệu giỏ hàng
    const dataSource = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
    }));

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '20px' }}>Giỏ hàng</h2>
            <Loading isPending={false}>
                <Row gutter={[16, 16]}>
                    <Col span={18}>
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            pagination={false}
                            bordered
                        />
                        {dataSource.length > 0 && (
                            <Button
                                type="primary"
                                danger
                                onClick={handleRemoveSelected}
                                disabled={selectedRowKeys.length === 0}
                                style={{ marginTop: '10px' }}
                            >
                                Xóa các sản phẩm đã chọn
                            </Button>
                        )}
                    </Col>
                    <Col span={6}>
                        <div style={{ padding: '20px', border: '1px solid #d9d9d9', borderRadius: '5px' }}>
                            <h3>Tổng tiền</h3>
                            <p style={{ fontSize: '20px', color: 'red', marginBottom: '20px' }}>
                                {totalPrice.toLocaleString()} ₫
                                <br />
                                <small style={{ fontSize: '12px', color: '#888' }}>
                                    (Đã bao gồm VAT nếu có)
                                </small>
                            </p>
                            <Button
                                type="primary"
                                danger
                                block
                                onClick={handleCheckout}
                                disabled={selectedRowKeys.length === 0}
                            >
                                Thanh toán
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Loading>
        </div>
    );
};

export default Cart;