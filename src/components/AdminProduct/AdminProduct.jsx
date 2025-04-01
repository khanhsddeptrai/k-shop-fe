import React, { useState, useEffect } from 'react';
import { ButtonAddUser, WrapperHeader } from './style';
import { PlusSquareTwoTone, EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';
import { Button, Form, Input, Modal, Select, Upload } from 'antd';
import {
    getAllCategory, getAllProduct,
    addNewProduct, deleteProduct, updateProduct
} from '../../services/ProductService';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux'; // Thêm useSelector để lấy token
import { getBase64 } from '../../untils';
import { useNavigate, useLocation } from 'react-router-dom';

const { Option } = Select;
const { TextArea } = Input;

const AdminProduct = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [stateProduct, setStateProduct] = useState({
        name: "",
        category: "",
        price: "",
        description: "",
        image: ""
    });
    const [editProduct, setEditProduct] = useState(null);
    const [viewProduct, setViewProduct] = useState(null);
    const [deleteProductId, setDeleteProductId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();

    const { access_token } = useSelector(state => state.user); // Lấy token từ Redux

    const getQueryParams = () => {
        const params = new URLSearchParams(location.search);
        return {
            page: parseInt(params.get('page')) || 1,
            limit: parseInt(params.get('limit')) || 4,
        };
    };

    const initialValues = {
        name: "",
        category: "",
        price: "",
        description: "",
        image: ""
    };

    const handleViewDetail = (record) => {
        setViewProduct(record);
        setIsViewModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditProduct(record);
        console.log("edit product", record);
        setIsEditModalOpen(true);
        editForm.setFieldsValue(record);
    };

    const handleDelete = (productId) => {
        setDeleteProductId(productId);
        setIsDeleteModalOpen(true);
    };

    const columns = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            width: '20%',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Loại',
            dataIndex: 'category',
            width: '15%',
            render: (categoryId) => {
                const category = categories.find(cat => cat._id === categoryId);
                return category ? category.name : (categoryId || 'Không xác định');
            },
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            width: '10%',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            width: '30%',
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            width: '10%',
            render: (image) => (
                <img src={image} alt="product" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: '15%',
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

    const dataSource = products.map((product) => ({
        key: product._id,
        name: product.name,
        category: product.category._id,
        price: product.price,
        description: product.description,
        image: product.image,
    }));

    const fetchCategories = async () => {
        try {
            const response = await getAllCategory();
            console.log('Categories fetched:', response.data);
            setCategories(response.data || []);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            setCategories([]);
        }
    };

    const fetchProducts = async (page = currentPage, limit = pageSize) => {
        try {
            const response = await getAllProduct({ page, limit });
            console.log('Products fetched:', response.data);
            setProducts(response.data || []);
            setTotalProducts(response.totalProduct || 0);
            setTotalPages(response.totalPage || 0);
            setCurrentPage(response.currentPage || 1);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setProducts([]);
        }
    };

    useEffect(() => {
        const { page, limit } = getQueryParams();
        setCurrentPage(page);
        setPageSize(limit);
        const loadData = async () => {
            await fetchCategories();
            await fetchProducts(page, limit);
        };
        loadData();
    }, [location.search]);

    const handleTableChange = (pagination) => {
        const { current, pageSize: newPageSize } = pagination;
        setCurrentPage(current);
        setPageSize(newPageSize);
        // fetchProducts(current, newPageSize);
        navigate(`/system/admin/product?page=${current}&limit=${newPageSize}`);
    };

    const onFinish = async (values) => {
        try {
            const productData = { ...values, image: stateProduct.image };
            const response = await addNewProduct(productData);
            if (response.status === "success") {
                toast.success(response.message);
                setStateProduct(productData);
                setIsModalCreateOpen(false);
                form.resetFields();
                fetchProducts(currentPage, pageSize);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Failed to add product:', error);
            toast.error('Thêm sản phẩm thất bại!');
        }
    };

    const onEditFinish = async (values) => {
        // console.log("check asscess token: ", access_token)
        try {
            const productData = { ...values, image: editProduct.image, id: editProduct.key };
            const response = await updateProduct(productData, access_token);

            if (response.status === "success") {
                setEditProduct(null);
                setIsEditModalOpen(false);
                editForm.resetFields();
                fetchProducts(currentPage, pageSize);
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Failed to update product:', error);
            toast.error('Cập nhật sản phẩm thất bại!');
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
        setStateProduct(initialValues);
        form.resetFields();
    };

    const handleEditCancel = () => {
        setIsEditModalOpen(false);
        setEditProduct(null);
        editForm.resetFields();
    };

    const handleViewCancel = () => {
        setIsViewModalOpen(false);
        setViewProduct(null);
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false);
        setDeleteProductId(null);
    };

    const handleOpenModalCreate = () => {
        setIsModalCreateOpen(true);
        setStateProduct(initialValues);
        form.resetFields();
    };

    const handleOnChange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value
        });
    };

    const handleCategoryChange = (value) => {
        setStateProduct({
            ...stateProduct,
            category: value
        });
    };

    const handleImageChange = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProduct({
            ...stateProduct,
            image: file.preview
        });
        form.setFieldsValue({ image: file.preview });
    };

    const handleEditOnChange = (e) => {
        setEditProduct({
            ...editProduct,
            [e.target.name]: e.target.value
        });
    };

    const handleEditCategoryChange = (value) => {
        setEditProduct({
            ...editProduct,
            category: value
        });
    };

    const handleEditImageChange = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setEditProduct({
            ...editProduct,
            image: file.preview
        });
        editForm.setFieldsValue({ image: file.preview });
    };

    const handleRowSelectionChange = (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await deleteProduct(deleteProductId);
            if (response.status === 'success') {
                setIsDeleteModalOpen(false);
                setDeleteProductId(null);
                await fetchProducts(currentPage, pageSize);
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Failed to delete product:', error);
            toast.error('Xóa sản phẩm thất bại!');
        }
    };

    return (
        <>
            <WrapperHeader>Quản lí sản phẩm</WrapperHeader>
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
                        total: totalProducts,
                        showSizeChanger: true,
                        pageSizeOptions: ['4', '5', '8'],
                        showTotal: () => null,
                    }}
                    onChange={handleTableChange}
                />
            </div>

            {/* Modal thêm sản phẩm */}
            <Modal
                title="Thêm sản phẩm"
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
                        label="Tên sản phẩm"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                    >
                        <Input value={stateProduct.name} onChange={handleOnChange} name="name" />
                    </Form.Item>

                    <Form.Item
                        label="Loại"
                        name="category"
                        rules={[{ required: true, message: 'Vui lòng chọn loại sản phẩm!' }]}
                    >
                        <Select
                            value={stateProduct.category}
                            onChange={handleCategoryChange}
                            placeholder="Chọn loại sản phẩm"
                        >
                            {categories.map((category) => (
                                <Option key={category._id} value={category._id}>
                                    {category.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Giá"
                        name="price"
                        rules={[
                            { required: true, message: 'Vui lòng nhập giá sản phẩm!' },
                            { pattern: /^[0-9]+$/, message: 'Giá phải là số!' }
                        ]}
                    >
                        <Input value={stateProduct.price} onChange={handleOnChange} name="price" />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }]}
                    >
                        <TextArea
                            value={stateProduct.description}
                            onChange={handleOnChange}
                            name="description"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Hình ảnh"
                        name="image"
                        rules={[{ required: true, message: 'Vui lòng chọn hình ảnh!' }]}
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
                            {stateProduct.image && (
                                <img
                                    src={stateProduct.image}
                                    alt="product preview"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',
                                        margin: '0 15px'
                                    }}
                                />
                            )}
                        </div>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal chỉnh sửa sản phẩm */}
            <Modal
                title="Chỉnh sửa sản phẩm"
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
                        label="Tên sản phẩm"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                    >
                        <Input value={editProduct?.name} onChange={handleEditOnChange} name="name" />
                    </Form.Item>

                    <Form.Item
                        label="Loại"
                        name="category"
                        rules={[{ required: true, message: 'Vui lòng chọn loại sản phẩm!' }]}
                    >
                        <Select
                            value={editProduct?.category}
                            onChange={handleEditCategoryChange}
                            placeholder="Chọn loại sản phẩm"
                        >
                            {categories.map((category) => (
                                <Option key={category._id} value={category._id}>
                                    {category.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Giá"
                        name="price"
                        rules={[
                            { required: true, message: 'Vui lòng nhập giá sản phẩm!' },
                            { pattern: /^[0-9]+$/, message: 'Giá phải là số!' }
                        ]}
                    >
                        <Input value={editProduct?.price} onChange={handleEditOnChange} name="price" />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }]}
                    >
                        <TextArea
                            value={editProduct?.description}
                            onChange={handleEditOnChange}
                            name="description"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Hình ảnh"
                        name="image"
                        rules={[{ required: true, message: 'Vui lòng chọn hình ảnh!' }]}
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
                            {editProduct?.image && (
                                <img
                                    src={editProduct.image}
                                    alt="product preview"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',
                                        margin: '0 15px',
                                        borderRadius: "5px"
                                    }}
                                />
                            )}
                        </div>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal xem chi tiết sản phẩm */}
            <Modal
                title="Chi tiết sản phẩm"
                open={isViewModalOpen}
                onOk={handleViewCancel}
                onCancel={handleViewCancel}
                okText="Đóng"
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                {viewProduct ? (
                    <Form
                        name="view"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        autoComplete="off"
                    >
                        <Form.Item label="Tên sản phẩm">
                            <Input
                                value={viewProduct.name || 'Không có'}
                                disabled
                                style={{
                                    color: '#000',
                                    backgroundColor: '#fff',
                                    borderColor: '#d9d9d9',
                                }}
                            />
                        </Form.Item>

                        <Form.Item label="Loại">
                            <Select
                                value={categories.find(cat => cat._id === viewProduct.category)?.name || viewProduct.category || 'Không xác định'}
                                disabled
                                style={{
                                    color: '#000',
                                }}
                                dropdownStyle={{
                                    pointerEvents: 'none',
                                }}
                            >
                                {categories.map((category) => (
                                    <Option key={category._id} value={category._id}>
                                        {category.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Giá">
                            <Input
                                value={viewProduct.price || 'Không có'}
                                disabled
                                style={{
                                    color: '#000',
                                    backgroundColor: '#fff',
                                    borderColor: '#d9d9d9',
                                }}
                            />
                        </Form.Item>

                        <Form.Item label="Mô tả">
                            <TextArea
                                value={viewProduct.description || 'Không có'}
                                disabled
                                style={{
                                    color: '#000',
                                    backgroundColor: '#fff',
                                    borderColor: '#d9d9d9'
                                }}
                            />
                        </Form.Item>

                        <Form.Item label="Hình ảnh">
                            {viewProduct.image ? (
                                <img
                                    src={viewProduct.image}
                                    alt={viewProduct.name || 'product'}
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                            ) : (
                                <Input
                                    value="Không có hình ảnh"
                                    disabled
                                    style={{
                                        color: '#000',
                                        backgroundColor: '#fff',
                                        borderColor: '#d9d9d9',
                                    }}
                                />
                            )}
                        </Form.Item>
                    </Form>
                ) : (
                    <p
                        style={{
                            textAlign: 'center',
                            color: '#999',
                            fontSize: '14px',
                            padding: '20px 0',
                        }}
                    >
                        Không có dữ liệu sản phẩm
                    </p>
                )}
            </Modal>

            {/* Modal xác nhận xóa sản phẩm */}
            <Modal
                title="Xác nhận xóa"
                open={isDeleteModalOpen}
                onOk={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                okText="Xóa"
                okType="danger"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
            </Modal>
        </>
    );
};

export default AdminProduct;