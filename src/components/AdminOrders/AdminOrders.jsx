import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Modal, Form, Input, Row, Col, Typography, Select } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useMutationHook } from '../../hooks/useMutationHook';
import TableComponent from '../TableComponent/TableComponent';
import { WrapperHeader } from '../AdminProduct/style';
import { getAllOrders, updateOrderStatus } from '../../services/OrderService';

const { Text } = Typography;
const { Option } = Select;

const AdminOrders = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { access_token } = useSelector(state => state.user);
    const [orders, setOrders] = useState([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [viewOrder, setViewOrder] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [form] = Form.useForm();

    // Get query params from URL
    const getQueryParams = () => {
        const params = new URLSearchParams(location.search);
        return {
            page: parseInt(params.get('page')) || 1,
            limit: parseInt(params.get('limit')) || 4,
        };
    };

    // Mutation to fetch orders with sorting
    const mutationGetOrders = useMutationHook((params) => getAllOrders(access_token, params));
    const { data: ordersData, isPending: isFetchingOrders } = mutationGetOrders;

    // Mutation to update order status
    const mutationUpdateStatus = useMutationHook((data) => {
        const { id, status, access_token } = data;
        return updateOrderStatus(id, { status }, access_token);
    });

    // Fetch orders with sorting
    useEffect(() => {
        const { page, limit } = getQueryParams();
        setCurrentPage(page);
        setPageSize(limit);
        mutationGetOrders.mutate({
            page,
            limit,
            sort: '-createdAt', // Sort by createdAt in descending order (newest first)
        });
    }, [location.search]);

    // Process API data
    useEffect(() => {
        if (ordersData?.status === 'success') {
            setOrders(ordersData.data || []);
            setTotalOrders(ordersData.totalOrders || 0);
            setTotalPages(ordersData.totalPage || 0);
            setCurrentPage(ordersData.currentPage || currentPage);
        } else if (ordersData?.status === 'ERR') {
            toast.error(ordersData.message || 'Lỗi khi tải danh sách đơn hàng');
        }
        setIsTableLoading(isFetchingOrders);
    }, [ordersData, isFetchingOrders]);

    // Handle status update
    const handleUpdateStatus = (orderId, newStatus) => {
        mutationUpdateStatus.mutate(
            { id: orderId, status: newStatus, access_token },
            {
                onSuccess: (response) => {
                    if (response.status === 'success') {
                        toast.success(response.message);
                        mutationGetOrders.mutate({
                            page: currentPage,
                            limit: pageSize,
                            sort: '-createdAt',
                        });
                    } else {
                        toast.error(response.message);
                    }
                },
                onError: () => {
                    toast.error('Lỗi khi cập nhật trạng thái');
                },
            }
        );
    };

    // Handle pagination change
    const handleTableChange = (pagination) => {
        const { current, pageSize: newPageSize } = pagination;
        setCurrentPage(current);
        setPageSize(newPageSize);
        navigate(`/system/admin/orders?page=${current}&limit=${newPageSize}`);
    };

    // Handle view order details
    const handleViewDetail = (record) => {
        setViewOrder(record);
        setIsViewModalOpen(true);
        console.log(record);
    };

    // Handle close view modal
    const handleViewCancel = () => {
        setIsViewModalOpen(false);
        setViewOrder(null);
    };

    // Handle open update status modal
    const handleOpenUpdateModal = (record) => {
        setSelectedOrder(record);
        setIsUpdateModalOpen(true);
        form.setFieldsValue({ status: record.status });
    };

    // Handle close update status modal
    const handleUpdateCancel = () => {
        setIsUpdateModalOpen(false);
        setSelectedOrder(null);
        form.resetFields();
    };

    // Handle submit update status
    const handleUpdateSubmit = () => {
        form.validateFields().then((values) => {
            handleUpdateStatus(selectedOrder.key, values.status);
            handleUpdateCancel();
        });
    };

    // Table columns
    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            width: '5%',
            render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
        },
        {
            title: 'Mã đơn hàng',
            dataIndex: 'orderCode',
            width: '20%',
            sorter: (a, b) => a.orderCode.localeCompare(b.orderCode),
            render: (text) => <p style={{ margin: "0" }}>{text}</p>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: '30%',
            sorter: (a, b) => a.status.localeCompare(b.status),
            filters: [
                { text: 'Chờ xử lý', value: 'pending' },
                { text: 'Đã xác nhận', value: 'confirmed' },
                { text: 'Đã giao', value: 'delivered' },
                { text: 'Đã hủy', value: 'cancelled' },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status, record) => {
                const statusMap = {
                    pending: { text: 'Chờ xử lý', color: 'warning' },
                    confirmed: { text: 'Đã xác nhận', color: 'warning' },
                    delivered: { text: 'Đã giao', color: 'success' },
                    cancelled: { text: 'Đã hủy', color: 'danger' },
                };
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {status === 'pending' ? (
                            <>
                                <Button
                                    type="primary"
                                    size="small"
                                    onClick={() => handleUpdateStatus(record.key, 'confirmed')}
                                    title="Xác nhận đơn hàng"
                                >
                                    Xác nhận
                                </Button>
                                <Button
                                    type="default"
                                    size="small"
                                    danger
                                    onClick={() => handleUpdateStatus(record.key, 'cancelled')}
                                    title="Hủy đơn hàng"
                                >
                                    Hủy
                                </Button>
                            </>
                        ) : (
                            <Text type={statusMap[status]?.color} style={{ fontWeight: '500', fontSize: '15px' }}>
                                {statusMap[status]?.text || status}
                            </Text>
                        )}
                    </div>
                );
            },
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            width: '20%',
            sorter: (a, b) => a.totalPrice - b.totalPrice,
            render: (price) => `${price.toLocaleString('vi-VN')} ₫`,
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createdAt',
            width: '20%',
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            defaultSortOrder: 'descend', // Default sort by newest first
            render: (createdAt) => new Date(createdAt).toLocaleString('vi-VN'),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: '15%',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(record)}
                        title="Xem chi tiết"
                        style={{ fontSize: '17px' }}
                    />
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleOpenUpdateModal(record)}
                        title="Cập nhật trạng thái"
                        style={{ fontSize: '17px' }}
                    />
                </div>
            ),
        },
    ];

    // Table data
    const dataSource = orders.map((order) => ({
        key: order._id,
        orderCode: order._id,
        status: order.status,
        totalPrice: order.totalPrice,
        user: order.user,
        orderItems: order.orderItems,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
    }));

    return (
        <>
            <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
            <div style={{ marginTop: '20px' }}>
                <TableComponent
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: totalOrders,
                        showSizeChanger: true,
                        pageSizeOptions: ['4', '5', '8'],
                        showTotal: () => null,
                    }}
                    onChange={handleTableChange}
                    loading={isTableLoading || mutationUpdateStatus.isPending}
                />
            </div>

            {/* View order details modal */}
            <Modal
                title="Chi tiết đơn hàng"
                open={isViewModalOpen}
                onOk={handleViewCancel}
                onCancel={handleViewCancel}
                okText="Đóng"
                cancelButtonProps={{ style: { display: 'none' } }}
                width={800}
            >
                {viewOrder ? (
                    <Form
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        style={{ maxWidth: 800 }}
                        autoComplete="off"
                    >
                        <Form.Item label="Mã đơn hàng">
                            <Input
                                value={viewOrder.orderCode}
                                disabled
                                style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d9d9d9' }}
                            />
                        </Form.Item>
                        <Form.Item label="Trạng thái">
                            <Input
                                value={
                                    {
                                        pending: 'Chờ xử lý',
                                        confirmed: 'Đã xác nhận',
                                        delivered: 'Đã giao',
                                        cancelled: 'Đã hủy',
                                    }[viewOrder.status] || viewOrder.status
                                }
                                disabled
                                style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d9d9d9' }}
                            />
                        </Form.Item>
                        <Form.Item label="Tổng tiền">
                            <Input
                                value={`${viewOrder.totalPrice.toLocaleString('vi-VN')} ₫`}
                                disabled
                                style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d9d9d9' }}
                            />
                        </Form.Item>
                        <Form.Item label="Phương thức thanh toán">
                            <Input
                                value={
                                    {
                                        COD: 'Thanh toán khi giao hàng',
                                        BankTransfer: 'Chuyển khoản ngân hàng',
                                        MoMo: 'MoMo',
                                    }[viewOrder.paymentMethod] || viewOrder.paymentMethod
                                }
                                disabled
                                style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d9d9d9' }}
                            />
                        </Form.Item>
                        <Form.Item label="Người đặt">
                            <Input
                                value={viewOrder.user.email || 'Không xác định'}
                                disabled
                                style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d9d9d9' }}
                            />
                        </Form.Item>
                        <Form.Item label="Địa chỉ giao hàng">
                            <Input.TextArea
                                value={
                                    viewOrder.shippingAddress
                                        ? `${viewOrder.shippingAddress.name}, ${viewOrder.shippingAddress.address}, ${viewOrder.shippingAddress.city}, SĐT: ${viewOrder.shippingAddress.phone}`
                                        : 'Không có'
                                }
                                disabled
                                style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d9d9d9' }}
                            />
                        </Form.Item>
                        <Form.Item label="Ngày đặt">
                            <Input
                                value={new Date(viewOrder.createdAt).toLocaleString('vi-VN')}
                                disabled
                                style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d9d9d9' }}
                            />
                        </Form.Item>
                        <Form.Item label="Sản phẩm">
                            <div>
                                {viewOrder.orderItems?.map((item, index) => (
                                    <Row key={index} style={{ marginBottom: '10px', alignItems: 'center' }}>
                                        <Col span={4}>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <Text>{item.name}</Text>
                                            <br />
                                            <Text type="secondary">Số lượng: {item.quantity}</Text>
                                        </Col>
                                        <Col span={8} style={{ textAlign: 'right' }}>
                                            <Text>{(item.price * item.quantity).toLocaleString('vi-VN')} ₫</Text>
                                        </Col>
                                    </Row>
                                ))}
                            </div>
                        </Form.Item>
                    </Form>
                ) : (
                    <p style={{ textAlign: 'center', color: '#999', fontSize: '14px', padding: '20px 0' }}>
                        Không có dữ liệu đơn hàng
                    </p>
                )}
            </Modal>

            {/* Update status modal */}
            <Modal
                title="Cập nhật trạng thái đơn hàng"
                open={isUpdateModalOpen}
                onOk={handleUpdateSubmit}
                onCancel={handleUpdateCancel}
                okText="Cập nhật"
                cancelText="Hủy"
            >
                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                >
                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                    >
                        <Select placeholder="Chọn trạng thái">
                            <Option value="pending">Chờ xử lý</Option>
                            <Option value="confirmed">Đã xác nhận</Option>
                            <Option value="delivered">Đã giao</Option>
                            <Option value="cancelled">Đã hủy</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AdminOrders;