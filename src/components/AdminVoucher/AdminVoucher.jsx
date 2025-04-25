import React, { useState, useEffect } from 'react';
import { ButtonAddUser, WrapperHeader } from '../AdminProduct/style';
import { PlusSquareTwoTone, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';
import { Button, Form, Input, Modal, DatePicker } from 'antd';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useMutationHook } from '../../hooks/useMutationHook';
import Loading from '../../components/Loading/Loading';
import moment from 'moment';
import { addVoucher, getAllVoucher, updateVoucher, deleteVoucher } from '../../services/VoucherService';

const AdminVoucher = () => {
    const { access_token } = useSelector(state => state.user);

    const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false); // State cho modal xóa
    const [stateVoucher, setStateVoucher] = useState({
        percent: '',
        maxUsage: '',
        minOrderValue: '',
        expiresAt: null,
    });
    const [viewVoucher, setViewVoucher] = useState(null);
    const [updateVoucherData, setUpdateVoucherData] = useState(null);
    const [deleteVoucherData, setDeleteVoucherData] = useState(null); // State lưu voucher cần xóa
    const [vouchers, setVouchers] = useState([]);
    const [isTableLoading, setIsTableLoading] = useState(false);

    const [form] = Form.useForm();
    const [updateForm] = Form.useForm();

    const initialValues = {
        percent: '',
        maxUsage: '',
        minOrderValue: '',
        expiresAt: null,
    };

    // Mutation hooks for APIs
    const mutationAdd = useMutationHook(data => addVoucher(data, access_token));
    const mutationUpdate = useMutationHook(data => updateVoucher(data, access_token));
    const mutationDelete = useMutationHook(data => deleteVoucher(data, access_token)); // Mutation cho xóa

    const { data: addData, isPending: isAdding } = mutationAdd;
    const { data: updateData, isPending: isUpdating } = mutationUpdate;
    const { data: deleteData, isPending: isDeleting } = mutationDelete; // Trạng thái xóa

    // Handle mutation results for add
    useEffect(() => {
        if (addData?.status === 'success') {
            toast.success(addData.message || 'Thêm voucher thành công');
            setIsModalCreateOpen(false);
            form.resetFields();
            setStateVoucher(initialValues);
            fetchVouchers();
        } else if (addData?.status === 'ERR') {
            toast.error(addData.message || 'Lỗi khi thêm voucher');
        }
    }, [addData]);

    // Handle mutation results for update
    useEffect(() => {
        if (updateData?.status === 'success') {
            toast.success(updateData.message || 'Cập nhật voucher thành công');
            setIsModalUpdateOpen(false);
            updateForm.resetFields();
            setUpdateVoucherData(null);
            fetchVouchers();
        } else if (updateData?.status === 'ERR') {
            toast.error(updateData.message || 'Lỗi khi cập nhật voucher');
        }
    }, [updateData]);

    // Handle mutation results for delete
    useEffect(() => {
        if (deleteData?.status === 'success') {
            toast.success(deleteData.message || 'Xóa voucher thành công');
            setIsModalDeleteOpen(false);
            setDeleteVoucherData(null);
            fetchVouchers();
        } else if (deleteData?.status === 'ERR') {
            toast.error(deleteData.message || 'Lỗi khi xóa voucher');
        }
    }, [deleteData]);

    // Fetch vouchers
    const fetchVouchers = async () => {
        setIsTableLoading(true);
        try {
            const response = await getAllVoucher(access_token);
            setVouchers(response.data || []);
        } catch (error) {
            console.error('Failed to fetch vouchers:', error);
            setVouchers([]);
            toast.error('Lỗi khi lấy danh sách voucher');
        } finally {
            setIsTableLoading(false);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    const handleViewDetail = (record) => {
        setViewVoucher(record);
        setIsViewModalOpen(true);
    };

    const handleUpdateVoucher = (record) => {
        console.log('record', record);
        setUpdateVoucherData(record);
        setIsModalUpdateOpen(true);
        updateForm.setFieldsValue({
            percent: record.percent,
            maxUsage: record.maxUsage,
            minOrderValue: record.minOrderValue,
            expiresAt: record.expiresAt ? moment(record.expiresAt) : null,
        });
    };

    const handleDeleteVoucher = (record) => {
        setDeleteVoucherData(record);
        setIsModalDeleteOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!deleteVoucherData?.id) {
            toast.error('Không tìm thấy ID voucher để xóa');
            return;
        }
        mutationDelete.mutate(deleteVoucherData.id);
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            width: '10%',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Mã voucher',
            dataIndex: 'code',
            width: '20%',
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Giảm giá (%)',
            dataIndex: 'percent',
            width: '15%',
        },
        {
            title: 'Tối đa',
            dataIndex: 'maxUsage',
            width: '10%',
        },
        {
            title: 'Đã dùng',
            dataIndex: 'usedCount',
            width: '10%',
        },
        {
            title: 'Áp dụng',
            dataIndex: 'minOrderValue',
            width: '15%',
            render: (text) => (`${text.toLocaleString('vi-VN')}đ`),
        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'expiresAt',
            width: '15%',
            render: (text) => (text ? moment(text).format('DD/MM/YYYY') : 'Không có'),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: '15%',
            render: (_, record) => (
                <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(record)}
                        title="Xem chi tiết"
                        style={{ fontSize: '16px', padding: 0 }}
                    />
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleUpdateVoucher(record)}
                        title="Sửa voucher"
                        style={{ fontSize: '16px', color: '#1890ff', padding: 0 }}
                    />
                    <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteVoucher(record)}
                        title="Xóa voucher"
                        style={{ fontSize: '16px', color: '#ff4d4f', padding: 0 }}
                    />
                </div>
            ),
        },
    ];

    const dataSource = vouchers.map((voucher) => ({
        id: voucher._id,
        code: voucher.code,
        percent: voucher.percent,
        usedCount: voucher.usedCount,
        maxUsage: voucher.maxUsage,
        minOrderValue: voucher.minOrderValue,
        expiresAt: voucher.expiresAt,
    }));

    const onFinish = (values) => {
        const voucherData = {
            ...values,
            expiresAt: values.expiresAt ? values.expiresAt.toISOString() : null,
        };
        mutationAdd.mutate(voucherData);
    };

    const onUpdateFinish = (values) => {
        const voucherData = {
            id: updateVoucherData.id,
            ...values,
            expiresAt: values.expiresAt ? values.expiresAt.toISOString() : null,
        };
        mutationUpdate.mutate(voucherData);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleOk = () => {
        form.submit();
        console.log('stateVoucher oke');
    };

    const handleUpdateOk = () => {
        updateForm.submit();
    };

    const handleCancel = () => {
        setIsModalCreateOpen(false);
        setStateVoucher(initialValues);
        form.resetFields();
    };

    const handleUpdateCancel = () => {
        setIsModalUpdateOpen(false);
        setUpdateVoucherData(null);
        updateForm.resetFields();
    };

    const handleDeleteCancel = () => {
        setIsModalDeleteOpen(false);
        setDeleteVoucherData(null);
    };

    const handleViewCancel = () => {
        setIsViewModalOpen(false);
        setViewVoucher(null);
    };

    const handleOpenModalCreate = () => {
        setIsModalCreateOpen(true);
        setStateVoucher(initialValues);
        form.resetFields();
    };

    const handleOnChange = (e) => {
        setStateVoucher({
            ...stateVoucher,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            <WrapperHeader>Quản lý voucher</WrapperHeader>
            <ButtonAddUser onClick={handleOpenModalCreate}>
                <PlusSquareTwoTone style={{ fontSize: '50px' }} />
            </ButtonAddUser>
            <div style={{ marginTop: '10px' }}>
                <Loading isPending={isTableLoading}>
                    <TableComponent
                        columns={columns}
                        dataSource={dataSource}
                    />
                </Loading>
            </div>

            {/* Modal thêm voucher */}
            <Modal
                title="Thêm voucher"
                open={isModalCreateOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Thêm"
                cancelText="Hủy"
                style={{ marginTop: '50px' }}
            >
                <Loading isPending={isAdding}>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        initialValues={initialValues}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Giảm giá (%)"
                            name="percent"
                            rules={[
                                { required: true, message: 'Vui lòng nhập giá trị giảm giá!' },
                                {
                                    type: 'number',
                                    min: 0,
                                    max: 100,
                                    message: 'Giảm giá phải từ 0 đến 100%!',
                                    transform: (value) => Number(value),
                                },
                            ]}
                        >
                            <Input
                                type="number"
                                onChange={handleOnChange}
                                name="percent"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Số lần sử dụng tối đa"
                            name="maxUsage"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số lần sử dụng tối đa!' },
                                {
                                    type: 'number',
                                    min: 1,
                                    message: 'Số lần sử dụng phải ít nhất là 1!',
                                    transform: (value) => Number(value),
                                },
                            ]}
                        >
                            <Input
                                type="number"
                                onChange={handleOnChange}
                                name="maxUsage"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Giá trị đơn hàng tối thiểu"
                            name="minOrderValue"
                            rules={[
                                { required: true, message: 'Vui lòng nhập giá trị đơn hàng tối thiểu!' },
                                {
                                    type: 'number',
                                    min: 0,
                                    message: 'Giá trị đơn hàng tối thiểu không được âm!',
                                    transform: (value) => Number(value),
                                },
                            ]}
                        >
                            <Input
                                type="number"
                                onChange={handleOnChange}
                                name="minOrderValue"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Ngày hết hạn"
                            name="expiresAt"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn!' }]}
                        >
                            <DatePicker
                                format="DD/MM/YYYY"
                                onChange={(date) => {
                                    setStateVoucher({ ...stateVoucher, expiresAt: date });
                                }}
                                disabledDate={(current) => current && current < moment().startOf('day')}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Form>
                </Loading>
            </Modal>

            {/* Modal cập nhật voucher */}
            <Modal
                title="Cập nhật voucher"
                open={isModalUpdateOpen}
                onOk={handleUpdateOk}
                onCancel={handleUpdateCancel}
                okText="Cập nhật"
                cancelText="Hủy"
                style={{ marginTop: '50px' }}
            >
                <Loading isPending={isUpdating}>
                    <Form
                        form={updateForm}
                        name="update"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        onFinish={onUpdateFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Giảm giá (%)"
                            name="percent"
                            rules={[
                                { required: true, message: 'Vui lòng nhập giá trị giảm giá!' },
                                {
                                    type: 'number',
                                    min: 0,
                                    max: 100,
                                    message: 'Giảm giá phải từ 0 đến 100%!',
                                    transform: (value) => Number(value),
                                },
                            ]}
                        >
                            <Input
                                type="number"
                                name="percent"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Số lần sử dụng tối đa"
                            name="maxUsage"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số lần sử dụng tối đa!' },
                                {
                                    type: 'number',
                                    min: updateVoucherData?.usedCount || 1,
                                    message: `Số lần sử dụng phải lớn hơn hoặc bằng ${updateVoucherData?.usedCount || 1}!`,
                                    transform: (value) => Number(value),
                                },
                            ]}
                        >
                            <Input
                                type="number"
                                name="maxUsage"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Giá trị đơn hàng tối thiểu"
                            name="minOrderValue"
                            rules={[
                                { required: true, message: 'Vui lòng nhập giá trị đơn hàng tối thiểu!' },
                                {
                                    type: 'number',
                                    min: 0,
                                    message: 'Giá trị đơn hàng tối thiểu không được âm!',
                                    transform: (value) => Number(value),
                                },
                            ]}
                        >
                            <Input
                                type="number"
                                name="minOrderValue"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Ngày hết hạn"
                            name="expiresAt"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn!' }]}
                        >
                            <DatePicker
                                format="DD/MM/YYYY"
                                disabledDate={(current) => current && current < moment().startOf('day')}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Form>
                </Loading>
            </Modal>

            {/* Modal xóa voucher */}
            <Modal
                title="Xác nhận xóa voucher"
                open={isModalDeleteOpen}
                onOk={handleConfirmDelete}
                onCancel={handleDeleteCancel}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true, loading: isDeleting }}
            >
                <p>Bạn có chắc chắn muốn xóa voucher <strong>{deleteVoucherData?.code}</strong> không?</p>
                <p>Hành động này không thể hoàn tác!</p>
            </Modal>

            {/* Modal xem chi tiết voucher */}
            <Modal
                title="Chi tiết voucher"
                open={isViewModalOpen}
                onOk={handleViewCancel}
                onCancel={handleViewCancel}
                okText="Đóng"
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                {viewVoucher ? (
                    <Form
                        name="view"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        autoComplete="off"
                    >
                        <Form.Item label="Mã voucher">
                            <Input
                                value={viewVoucher.code || 'Không có'}
                                disabled
                                style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d9d9d9' }}
                            />
                        </Form.Item>
                        <Form.Item label="Giảm giá (%)">
                            <Input
                                value={viewVoucher.percent || 'Không có'}
                                disabled
                                style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d9d9d9' }}
                            />
                        </Form.Item>
                        <Form.Item label="Số lần sử dụng tối đa">
                            <Input
                                value={viewVoucher.maxUsage || 'Không có'}
                                disabled
                                style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d9d9d9' }}
                            />
                        </Form.Item>
                        <Form.Item label="Giá trị đơn hàng tối thiểu">
                            <Input
                                value={viewVoucher.minOrderValue || 'Không có'}
                                disabled
                                style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d9d9d9' }}
                            />
                        </Form.Item>
                        <Form.Item label="Ngày hết hạn">
                            <Input
                                value={viewVoucher.expiresAt ? moment(viewVoucher.expiresAt).format('DD/MM/YYYY') : 'Không có'}
                                disabled
                                style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d9d9d9' }}
                            />
                        </Form.Item>
                    </Form>
                ) : (
                    <p style={{ textAlign: 'center', color: '#999', fontSize: '14px', padding: '20px 0' }}>
                        Không có dữ liệu voucher
                    </p>
                )}
            </Modal>
        </>
    );
};

export default AdminVoucher;