import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ButtonAddUser, WrapperHeader } from '../AdminProduct/style';
import { PlusSquareTwoTone, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';
import { Button, Form, Input, Modal } from 'antd';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useMutationHook } from '../../hooks/useMutationHook';
import Loading from '../../components/Loading/Loading';
import {
    getAllCategory,
    addNewCategory,
    updateCategory,
    deleteCategory
} from '../../services/CategoryService';

const { TextArea } = Input;

const AdminCategory = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { access_token } = useSelector(state => state.user);

    const getQueryParams = () => {
        const params = new URLSearchParams(location.search);
        return {
            page: parseInt(params.get('page')) || 1,
            limit: parseInt(params.get('limit')) || 4,
        };
    };

    const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleteManyModalOpen, setIsDeleteManyModalOpen] = useState(false);
    const [stateCategory, setStateCategory] = useState({ name: '', description: '' });
    const [editCategory, setEditCategory] = useState(null);
    const [viewCategory, setViewCategory] = useState(null);
    const [deleteCategoryId, setDeleteCategoryId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [totalCategories, setTotalCategories] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(getQueryParams().page);
    const [pageSize, setPageSize] = useState(getQueryParams().limit);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isTableLoading, setIsTableLoading] = useState(false);

    const [form] = Form.useForm();
    const [editForm] = Form.useForm();

    const initialValues = { name: '', description: '' };

    // Mutation hooks cho các API
    const mutationAdd = useMutationHook(data => addNewCategory(data));
    const mutationUpdate = useMutationHook(data => {
        const { id, ...rests } = data;
        return updateCategory({ id, ...rests }, access_token);
    });
    const mutationDelete = useMutationHook(id => deleteCategory(id));
    const mutationDeleteMany = useMutationHook(ids => {
        return Promise.all(ids.map(id => deleteCategory(id)));
    });

    const { data: addData, isPending: isAdding } = mutationAdd;
    const { data: updateData, isPending: isUpdating } = mutationUpdate;
    const { data: deleteData, isPending: isDeleting } = mutationDelete;
    const { data: deleteManyData, isPending: isDeletingMany } = mutationDeleteMany;

    // Xử lý kết quả từ mutation
    useEffect(() => {
        if (addData?.status === 'success') {
            toast.success(addData.message || 'Thêm danh mục thành công');
            setIsModalCreateOpen(false);
            form.resetFields();
            setStateCategory(initialValues);
            fetchCategories(currentPage, pageSize);
        } else if (addData?.status === 'ERR') {
            toast.error(addData.message || 'Lỗi khi thêm danh mục');
        }
    }, [addData]);

    useEffect(() => {
        if (updateData?.status === 'success') {
            toast.success(updateData.message || 'Cập nhật danh mục thành công');
            setIsEditModalOpen(false);
            editForm.resetFields();
            setEditCategory(null);
            fetchCategories(currentPage, pageSize);
        } else if (updateData?.status === 'ERR') {
            toast.error(updateData.message || 'Lỗi khi cập nhật danh mục');
        }
    }, [updateData]);

    useEffect(() => {
        if (deleteData?.status === 'success') {
            toast.success(deleteData.message || 'Xóa danh mục thành công');
            setIsDeleteModalOpen(false);
            setDeleteCategoryId(null);
            fetchCategories(currentPage, pageSize);
        } else if (deleteData?.status === 'ERR') {
            toast.error(deleteData.message || 'Lỗi khi xóa danh mục');
        }
    }, [deleteData]);

    useEffect(() => {
        if (deleteManyData) {
            toast.success('Xóa nhiều danh mục thành công');
            setIsDeleteManyModalOpen(false);
            setSelectedRowKeys([]);
            fetchCategories(currentPage, pageSize);
        } else if (deleteManyData?.status === 'ERR') {
            toast.error('Lỗi khi xóa nhiều danh mục');
        }
    }, [deleteManyData]);

    // Lấy danh sách danh mục
    const fetchCategories = async (page = currentPage, limit = pageSize) => {
        setIsTableLoading(true);
        try {
            const response = await getAllCategory({ page, limit });
            setCategories(response.data || []);
            setTotalCategories(response.totalCategory || response.data.length);
            setTotalPages(response.totalPage || Math.ceil(response.data.length / limit));
            setCurrentPage(response.currentPage || page);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            setCategories([]);
            toast.error('Lỗi khi lấy danh sách danh mục');
        } finally {
            setIsTableLoading(false);
        }
    };

    useEffect(() => {
        const { page, limit } = getQueryParams();
        setCurrentPage(page);
        setPageSize(limit);
        fetchCategories(page, limit);
    }, [location.search]);

    const handleTableChange = (pagination) => {
        const { current, pageSize: newPageSize } = pagination;
        setCurrentPage(current);
        setPageSize(newPageSize);
        navigate(`/system/admin/category?page=${current}&limit=${newPageSize}`);
    };

    const handleViewDetail = (record) => {
        setViewCategory(record);
        setIsViewModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditCategory(record);
        setIsEditModalOpen(true);
        editForm.setFieldsValue(record);
    };

    const handleDelete = (categoryId) => {
        setDeleteCategoryId(categoryId);
        setIsDeleteModalOpen(true);
    };

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            width: '10%',
            render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            width: '30%',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            width: '40%',
            render: (text) => (text ? text : 'Không có mô tả'),
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
                        style={{ fontSize: '17px' }}
                    />
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        title="Sửa"
                        style={{ fontSize: '17px' }}
                    />
                    <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.key)}
                        danger
                        title="Xóa"
                        style={{ fontSize: '17px' }}
                    />
                </div>
            ),
        },
    ];

    const dataSource = categories.map((category) => ({
        key: category._id,
        name: category.name,
        description: category.description,
    }));

    const onFinish = (values) => {
        mutationAdd.mutate(values);
    };

    const onEditFinish = (values) => {
        const categoryData = {
            id: editCategory.key,
            ...values,
        };
        mutationUpdate.mutate(categoryData);
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
        setStateCategory(initialValues);
        form.resetFields();
    };

    const handleEditCancel = () => {
        setIsEditModalOpen(false);
        setEditCategory(null);
        editForm.resetFields();
    };

    const handleViewCancel = () => {
        setIsViewModalOpen(false);
        setViewCategory(null);
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false);
        setDeleteCategoryId(null);
    };

    const handleOpenModalCreate = () => {
        setIsModalCreateOpen(true);
        setStateCategory(initialValues);
        form.resetFields();
    };

    const handleOnChange = (e) => {
        setStateCategory({
            ...stateCategory,
            [e.target.name]: e.target.value,
        });
    };

    const handleEditOnChange = (e) => {
        setEditCategory({
            ...editCategory,
            [e.target.name]: e.target.value,
        });
    };

    const handleDeleteConfirm = () => {
        mutationDelete.mutate(deleteCategoryId);
    };

    const handleDeleteSelected = () => {
        if (selectedRowKeys.length > 0) {
            setIsDeleteManyModalOpen(true);
        } else {
            toast.warning('Vui lòng chọn ít nhất một danh mục để xóa!');
        }
    };

    const handleDeleteManyConfirm = () => {
        mutationDeleteMany.mutate(selectedRowKeys);
    };

    return (
        <>
            <WrapperHeader>Quản lý danh mục sản phẩm</WrapperHeader>
            <ButtonAddUser onClick={handleOpenModalCreate}>
                <PlusSquareTwoTone style={{ fontSize: '50px' }} />
            </ButtonAddUser>
            <div style={{ marginTop: '10px' }}>
                <Loading isPending={isTableLoading}>
                    <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                        <Button
                            type="primary"
                            danger
                            onClick={handleDeleteSelected}
                            disabled={selectedRowKeys.length === 0}
                            style={{ marginBottom: '10px' }}
                        >
                            Xóa các danh mục đã chọn
                        </Button>
                    </div>
                    <TableComponent
                        columns={columns}
                        dataSource={dataSource}
                        rowSelection={rowSelection}
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: totalCategories,
                            showSizeChanger: true,
                            pageSizeOptions: ['4', '5', '8'],
                            showTotal: () => null,
                        }}
                        onChange={handleTableChange}
                    />
                </Loading>
            </div>

            {/* Modal thêm danh mục */}
            <Modal
                title="Thêm danh mục"
                open={isModalCreateOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Thêm"
                cancelText="Hủy"
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
                            label="Tên danh mục"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                        >
                            <Input value={stateCategory.name} onChange={handleOnChange} name="name" />
                        </Form.Item>
                        <Form.Item
                            label="Mô tả"
                            name="description"
                            rules={[{ max: 500, message: 'Mô tả không được dài quá 500 ký tự!' }]}
                        >
                            <TextArea
                                value={stateCategory.description}
                                onChange={handleOnChange}
                                name="description"
                                rows={4}
                                placeholder="Nhập mô tả danh mục"
                            />
                        </Form.Item>
                    </Form>
                </Loading>
            </Modal>

            {/* Modal chỉnh sửa danh mục */}
            <Modal
                title="Chỉnh sửa danh mục"
                open={isEditModalOpen}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Loading isPending={isUpdating}>
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
                            label="Tên danh mục"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                        >
                            <Input value={editCategory?.name} onChange={handleEditOnChange} name="name" />
                        </Form.Item>
                        <Form.Item
                            label="Mô tả"
                            name="description"
                            rules={[{ max: 500, message: 'Mô tả không được dài quá 500 ký tự!' }]}
                        >
                            <TextArea
                                value={editCategory?.description}
                                onChange={handleEditOnChange}
                                name="description"
                                rows={4}
                                placeholder="Nhập mô tả danh mục"
                            />
                        </Form.Item>
                    </Form>
                </Loading>
            </Modal>

            {/* Modal xem chi tiết danh mục */}
            <Modal
                title="Chi tiết danh mục"
                open={isViewModalOpen}
                onOk={handleViewCancel}
                onCancel={handleViewCancel}
                okText="Đóng"
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                {viewCategory ? (
                    <Form
                        name="view"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        autoComplete="off"
                    >
                        <Form.Item label="Tên danh mục">
                            <Input
                                value={viewCategory.name || 'Không có'}
                                disabled
                                style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d9d9d9' }}
                            />
                        </Form.Item>
                        <Form.Item label="Mô tả">
                            <TextArea
                                value={viewCategory.description || 'Không có mô tả'}
                                disabled
                                rows={4}
                                style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d9d9d9' }}
                            />
                        </Form.Item>
                    </Form>
                ) : (
                    <p style={{ textAlign: 'center', color: '#999', fontSize: '14px', padding: '20px 0' }}>
                        Không có dữ liệu danh mục
                    </p>
                )}
            </Modal>

            {/* Modal xác nhận xóa danh mục */}
            <Modal
                title="Xác nhận xóa"
                open={isDeleteModalOpen}
                onOk={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                okText="Xóa"
                okType="danger"
                cancelText="Hủy"
            >
                <Loading isPending={isDeleting}>
                    <p>Bạn có chắc chắn muốn xóa danh mục này không?</p>
                    <p style={{ color: 'red' }}>
                        Lưu ý: Xóa danh mục có thể ảnh hưởng đến các sản phẩm liên quan.
                    </p>
                </Loading>
            </Modal>

            {/* Modal xác nhận xóa nhiều danh mục */}
            <Modal
                title="Xác nhận xóa nhiều danh mục"
                open={isDeleteManyModalOpen}
                onOk={handleDeleteManyConfirm}
                onCancel={() => setIsDeleteManyModalOpen(false)}
                okText="Xóa"
                okType="danger"
                cancelText="Hủy"
            >
                <Loading isPending={isDeletingMany}>
                    <p>Bạn có chắc chắn muốn xóa các danh mục này không?</p>
                    <p style={{ color: 'red' }}>
                        Lưu ý: Xóa danh mục có thể ảnh hưởng đến các sản phẩm liên quan.
                    </p>
                </Loading>
            </Modal>
        </>
    );
};

export default AdminCategory;