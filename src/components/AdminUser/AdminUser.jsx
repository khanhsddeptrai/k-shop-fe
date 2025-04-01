import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ButtonAddUser, WrapperHeader } from './style';
import { PlusSquareTwoTone, EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';
import { Button, Form, Input, Modal, Select, Upload } from 'antd';
import {
    getAllUser, updateUser, getAllRole, addNewUser, deleteUser
} from '../../services/UserService';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getBase64 } from '../../untils';

const { Option } = Select;

const AdminUser = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [stateUser, setStateUser] = useState({
        name: "",
        email: "",
        role: "",
        phone: "",
        avatar: "",
        password: "",
        confirmPassword: ""
    });
    const [editUser, setEditUser] = useState(null);
    const [viewUser, setViewUser] = useState(null);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Phân trang
    const getQueryParams = () => {
        const params = new URLSearchParams(location.search);
        return {
            page: parseInt(params.get('page')) || 1,
            limit: parseInt(params.get('limit')) || 4,
        };
    };

    const [currentPage, setCurrentPage] = useState(getQueryParams().page);
    const [pageSize, setPageSize] = useState(getQueryParams().limit);

    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const { access_token } = useSelector(state => state.user);

    const initialValues = {
        name: "",
        email: "",
        role: "",
        phone: "",
        avatar: "",
        password: "",
        confirmPassword: ""
    };

    // Lấy danh sách role
    const fetchRoles = async () => {
        try {
            const response = await getAllRole();
            console.log('Roles fetched:', response.data);
            setRoles(response.data || []);
        } catch (error) {
            console.error('Failed to fetch roles:', error);
            setRoles([]);
        }
    };

    // Lấy danh sách người dùng
    const fetchUsers = async (page = currentPage, limit = pageSize) => {
        try {
            const response = await getAllUser({ page, limit });
            console.log('Users fetched:', response.data);
            setUsers(response.data || []);
            setTotalUsers(response.totalUser || 0);
            setTotalPages(response.totalPage || 0);
            setCurrentPage(response.currentPage || page);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setUsers([]);
        }
    };

    useEffect(() => {
        const { page, limit } = getQueryParams();
        setCurrentPage(page);
        setPageSize(limit);
        const loadData = async () => {
            await fetchRoles();
            await fetchUsers(page, limit);
        };
        loadData();
    }, [location.search]);

    const handleTableChange = (pagination) => {
        const { current, pageSize: newPageSize } = pagination;
        setCurrentPage(current);
        setPageSize(newPageSize);
        navigate(`/system/admin/users?page=${current}&limit=${newPageSize}`);
    };

    // Xem chi tiết người dùng
    const handleViewDetail = (record) => {
        setViewUser(record);
        setIsViewModalOpen(true);
    };

    // Chỉnh sửa người dùng
    const handleEdit = (record) => {
        setEditUser(record);
        setIsEditModalOpen(true);
        editForm.setFieldsValue(record);
    };

    // Xóa người dùng
    const handleDelete = (userId) => {
        setDeleteUserId(userId);
        setIsDeleteModalOpen(true);
    };

    // Cột của bảng
    const columns = [
        {
            title: 'Tên người dùng',
            dataIndex: 'name',
            width: '20%',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: '20%',

        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            width: '15%',
            render: (roleId) => {
                const role = roles.find(r => r._id === roleId);
                return role ? role.name : (roleId || 'Không xác định');
            },
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            width: '15%',
        },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            width: '15%',
            render: (avatar) => (
                avatar ? (
                    <img src={avatar} alt="avatar" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }} />
                ) : 'Không có'
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: '20%',
            render: (_, record) => (
                <div>
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(record)}
                        title="Xem chi tiết"
                        style={{ fontSize: "17px" }}
                    />
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        title="Sửa"
                        style={{ fontSize: "17px" }}
                    />
                    <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.key)}
                        danger
                        title="Xóa"
                        style={{ fontSize: "17px" }}
                    />
                </div>
            ),
        },
    ];

    const dataSource = users.map((user) => ({
        key: user._id,
        name: user.name, // Nếu không có name, ghép firstName và lastName
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
    }));

    const onFinish = async (values) => {
        try {
            const userData = { ...values, avatar: stateUser.avatar };
            const response = await addNewUser(userData);
            if (response.status === 'success') {
                toast.success(response.message);
                setStateUser(userData);
                setIsModalCreateOpen(false);
                form.resetFields();
                fetchUsers(currentPage, pageSize);
            } else {
                toast.error(response.message);
            }

        } catch (error) {
            console.error('Failed to add user:', error);
            toast.error('Thêm người dùng thất bại!');
        }
    };

    // Cập nhật người dùng
    const onEditFinish = async (values) => {
        try {
            const userData = { ...values, avatar: editUser.avatar, id: editUser.key };
            const response = await updateUser(editUser.key, userData, access_token);
            if (response.status === "success") {
                setEditUser(null);
                setIsEditModalOpen(false);
                editForm.resetFields();
                fetchUsers(currentPage, pageSize);
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Failed to update user:', error);
            toast.error('Cập nhật người dùng thất bại!');
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleOk = () => {
        form.submit();
    };

    const handleEditOk = () => {
        editForm.submit();
    };

    const handleCancel = () => {
        setIsModalCreateOpen(false);
        setStateUser(initialValues);
        form.resetFields();
    };

    const handleEditCancel = () => {
        setIsEditModalOpen(false);
        setEditUser(null);
        editForm.resetFields();
    };

    const handleViewCancel = () => {
        setIsViewModalOpen(false);
        setViewUser(null);
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false);
        setDeleteUserId(null);
    };

    const handleOpenModalCreate = () => {
        setIsModalCreateOpen(true);
        setStateUser(initialValues);
        form.resetFields();
    };

    const handleOnChange = (e) => {
        setStateUser({
            ...stateUser,
            [e.target.name]: e.target.value
        });
    };

    const handleRoleChange = (value) => {
        setStateUser({
            ...stateUser,
            role: value
        });
    };

    const handleImageChange = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateUser({
            ...stateUser,
            avatar: file.preview
        });
        form.setFieldsValue({ avatar: file.preview });
    };

    const handleEditOnChange = (e) => {
        setEditUser({
            ...editUser,
            [e.target.name]: e.target.value
        });
    };

    const handleEditRoleChange = (value) => {
        setEditUser({
            ...editUser,
            role: value
        });
    };

    const handleEditImageChange = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setEditUser({
            ...editUser,
            avatar: file.preview
        });
        editForm.setFieldsValue({ avatar: file.preview });
    };

    const handleRowSelectionChange = (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await deleteUser(deleteUserId, access_token);
            toast.success(response.message);
            setIsDeleteModalOpen(false);
            setDeleteUserId(null);
            await fetchUsers(currentPage, pageSize);
        } catch (error) {
            console.error('Failed to delete user:', error);
            toast.error('Xóa người dùng thất bại!');
        }
    };

    return (
        <>
            <WrapperHeader>Quản lí người dùng</WrapperHeader>
            <ButtonAddUser onClick={handleOpenModalCreate}>
                <PlusSquareTwoTone style={{ fontSize: "50px" }} />
            </ButtonAddUser>
            <div style={{ marginTop: "10px" }}>
                <TableComponent
                    columns={columns}
                    dataSource={dataSource}
                    selectionType="checkbox"
                    onRowSelectionChange={handleRowSelectionChange}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: totalUsers,
                        showSizeChanger: true,
                        pageSizeOptions: ['4', '5', '8'],
                        showTotal: () => null,
                    }}
                    onChange={handleTableChange}
                />
            </div>

            {/* Modal chỉnh sửa người dùng */}
            <Modal
                title="Chỉnh sửa người dùng"
                open={isEditModalOpen}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form
                    form={editForm}
                    name="edit"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    onFinish={onEditFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Tên người dùng"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
                    >
                        <Input value={editUser?.name} onChange={handleEditOnChange} name="name" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input value={editUser?.email} onChange={handleEditOnChange} name="email" />
                    </Form.Item>

                    <Form.Item
                        label="Vai trò"
                        name="role"
                        rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                    >
                        <Select
                            value={editUser?.role}
                            onChange={handleEditRoleChange}
                            placeholder="Chọn vai trò"
                        >
                            {roles.map((role) => (
                                <Option key={role._id} value={role._id}>
                                    {role.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại!' },
                            { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số!' }
                        ]}
                    >
                        <Input value={editUser?.phone} onChange={handleEditOnChange} name="phone" />
                    </Form.Item>

                    <Form.Item
                        label="Avatar"
                        name="avatar"
                        rules={[{ required: true, message: 'Vui lòng chọn avatar!' }]}
                    >
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Upload
                                onChange={handleEditImageChange}
                                maxCount={1}
                                showUploadList={false}
                                beforeUpload={() => false}
                            >
                                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                            </Upload>
                            {editUser?.avatar && (
                                <img
                                    src={editUser.avatar}
                                    alt="avatar preview"
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        objectFit: 'cover',
                                        margin: '0 15px',
                                        borderRadius: '50%'
                                    }}
                                />
                            )}
                        </div>
                    </Form.Item>
                </Form>
            </Modal>


            {/* Modal thêm người dùng */}
            <Modal
                title="Thêm người dùng"
                open={isModalCreateOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Thêm"
                cancelText="Hủy"
            >
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
                        label="Tên người dùng"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
                    >
                        <Input value={stateUser.name} onChange={handleOnChange} name="name" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input value={stateUser.email} onChange={handleOnChange} name="email" />
                    </Form.Item>

                    <Form.Item
                        label="Vai trò"
                        name="role"
                        rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                    >
                        <Select
                            value={stateUser.role}
                            onChange={handleRoleChange}
                            placeholder="Chọn vai trò"
                        >
                            {roles.map((role) => (
                                <Option key={role._id} value={role._id}>
                                    {role.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại!' },
                            { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số!' }
                        ]}
                    >
                        <Input value={stateUser.phone} onChange={handleOnChange} name="phone" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu!' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                        ]}
                    >
                        <Input.Password
                            value={stateUser.password}
                            onChange={handleOnChange}
                            name="password"
                            placeholder="Nhập mật khẩu"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Xác nhận mật khẩu"
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            value={stateUser.confirmPassword}
                            onChange={handleOnChange}
                            name="confirmPassword"
                            placeholder="Xác nhận mật khẩu"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Avatar"
                        name="avatar"
                    >
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Upload
                                onChange={handleImageChange}
                                maxCount={1}
                                showUploadList={false}
                                beforeUpload={() => false}
                            >
                                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                            </Upload>
                            {stateUser.avatar && (
                                <img
                                    src={stateUser.avatar}
                                    alt="avatar preview"
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        objectFit: 'cover',
                                        margin: '0 15px',
                                        borderRadius: '50%'
                                    }}
                                />
                            )}
                        </div>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal xem chi tiết người dùng */}
            <Modal
                title="Chi tiết người dùng"
                open={isViewModalOpen}
                onOk={handleViewCancel}
                onCancel={handleViewCancel}
                okText="Đóng"
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                {viewUser ? (
                    <Form
                        name="view"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        autoComplete="off"
                    >
                        <Form.Item label="Tên người dùng">
                            <Input
                                value={viewUser.name || 'Không có'}
                                disabled
                                style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d9d9d9' }}
                            />
                        </Form.Item>

                        <Form.Item label="Email">
                            <Input
                                value={viewUser.email || 'Không có'}
                                disabled
                                style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d9d9d9' }}
                            />
                        </Form.Item>

                        <Form.Item label="Vai trò">
                            <Select
                                value={roles.find(r => r._id === viewUser.role)?.name || viewUser.role || 'Không xác định'}
                                disabled
                                style={{ color: '#000' }}
                                dropdownStyle={{ pointerEvents: 'none' }}
                            >
                                {roles.map((role) => (
                                    <Option key={role._id} value={role._id}>
                                        {role.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Số điện thoại">
                            <Input
                                value={viewUser.phone || 'Không có'}
                                disabled
                                style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d9d9d9' }}
                            />
                        </Form.Item>

                        <Form.Item label="Avatar">
                            {viewUser.avatar ? (
                                <img
                                    src={viewUser.avatar}
                                    alt="avatar"
                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }}
                                />
                            ) : (
                                <Input
                                    value="Không có avatar"
                                    disabled
                                    style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d9d9d9' }}
                                />
                            )}
                        </Form.Item>
                    </Form>
                ) : (
                    <p style={{ textAlign: 'center', color: '#999', fontSize: '14px', padding: '20px 0' }}>
                        Không có dữ liệu người dùng
                    </p>
                )}
            </Modal>

            {/* Modal xác nhận xóa người dùng */}
            <Modal
                title="Xác nhận xóa"
                open={isDeleteModalOpen}
                onOk={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                okText="Xóa"
                okType="danger"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn xóa người dùng này không?</p>
            </Modal>
        </>
    );
};

export default AdminUser;