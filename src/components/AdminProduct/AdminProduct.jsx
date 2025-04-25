import React, { useState, useEffect } from 'react';
import { ButtonAddUser, WrapperHeader } from './style';
import { PlusSquareTwoTone, EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined, PlusCircleOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';
import { Button, Form, Input, Modal, Select, Upload } from 'antd';
import {
    getAllProduct,
    addNewProduct, deleteProduct, updateProduct,
    deleteManyProduct
} from '../../services/ProductService';
import { getAllCategory } from '../../services/CategoryService';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getBase64 } from '../../untils';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutationHook } from '../../hooks/useMutationHook';
import Loading from '../../components/Loading/Loading';
import { addStockImport } from '../../services/StockImportService';

const { Option } = Select;
const { TextArea } = Input;

const AdminProduct = () => {
    const navigate = useNavigate();
    const location = useLocation();

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
    const [stateProduct, setStateProduct] = useState({
        name: "",
        category: "",
        price: "",
        description: "",
        image: "",
        countInStock: 0,
    });
    const [editProduct, setEditProduct] = useState(null);
    const [viewProduct, setViewProduct] = useState(null);
    const [deleteProductId, setDeleteProductId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(getQueryParams().page);
    const [pageSize, setPageSize] = useState(getQueryParams().limit);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Thêm state để theo dõi các hàng được chọn
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [isDeleteManyModalOpen, setIsDeleteManyModalOpen] = useState(false);
    const [isStockImportModalOpen, setIsStockImportModalOpen] = useState(false);
    const [stockImportProduct, setStockImportProduct] = useState(null);
    const [stockImportForm] = Form.useForm();

    const { access_token } = useSelector(state => state.user);

    const initialValues = {
        name: "",
        category: "",
        price: "",
        description: "",
        image: "",
        countInStock: 0,
    };

    // Mutation hooks
    const mutationAdd = useMutationHook(data => addNewProduct(data));
    const mutationUpdate = useMutationHook(data => {
        const { id, access_token, ...rests } = data;
        return updateProduct({ id, ...rests }, access_token);
    });
    const mutationDelete = useMutationHook(data => deleteProduct(data.id, access_token));
    const mutationDeleteManyProduct = useMutationHook(data => {
        const { ids, access_token } = data;
        return deleteManyProduct(ids, access_token);
    });

    const { data: addData, isPending: isAdding } = mutationAdd;
    const { data: updateData, isPending: isUpdating } = mutationUpdate;
    const { data: deleteData, isPending: isDeleting } = mutationDelete;
    const { data: deleteManyData, isPending } = mutationDeleteManyProduct;
    const mutationStockImport = useMutationHook(data => addStockImport(data));
    const { data: stockImportData, isPending: isStockImporting } = mutationStockImport;

    // Xử lý kết quả từ mutation nhập kho
    useEffect(() => {
        if (stockImportData?.status === 'success') {
            toast.success(stockImportData.message);
            setIsStockImportModalOpen(false);
            stockImportForm.resetFields();
            fetchProducts(currentPage, pageSize);
        } else if (stockImportData?.status === 'ERR') {
            toast.error(stockImportData.message);
        }
    }, [stockImportData]);

    // Xử lý kết quả từ mutation
    useEffect(() => {
        if (addData?.status === 'success') {
            toast.success(addData.message);
            setIsModalCreateOpen(false);
            form.resetFields();
            fetchProducts(currentPage, pageSize);
        } else if (addData?.status === 'ERR') {
            toast.error(addData.message);
        }
    }, [addData]);

    useEffect(() => {
        if (updateData?.status === 'success') {
            toast.success(updateData.message);
            setIsEditModalOpen(false);
            editForm.resetFields();
            fetchProducts(currentPage, pageSize);
        } else if (updateData?.status === 'ERR') {
            toast.error(updateData.message);
        }
    }, [updateData]);

    useEffect(() => {
        if (deleteData?.status === 'success') {
            toast.success(deleteData.message);
            setIsDeleteModalOpen(false);
            setDeleteProductId(null);
            fetchProducts(currentPage, pageSize);
        } else if (deleteData?.status === 'ERR') {
            toast.error(deleteData.message);
        }
    }, [deleteData]);

    useEffect(() => {
        if (deleteManyData?.status === 'success') {
            toast.success(deleteManyData.message);
            setSelectedRowKeys([]);
            fetchProducts(currentPage, pageSize);
        } else if (deleteManyData?.status === 'ERR') {
            toast.error(deleteManyData.message);
        }
    }, [deleteManyData])

    const fetchCategories = async () => {
        try {
            const response = await getAllCategory();
            setCategories(response.data || []);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            setCategories([]);
        }
    };

    const fetchProducts = async (page = currentPage, limit = pageSize) => {
        setIsTableLoading(true); // Bật loading trước khi gọi API
        try {
            const response = await getAllProduct({ page, limit });
            setProducts(response.data || []);
            setTotalProducts(response.totalProduct || 0);
            setTotalPages(response.totalPage || 0);
            setCurrentPage(response.currentPage || page);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setProducts([]);
        } finally {
            setIsTableLoading(false);
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
        navigate(`/system/admin/product?page=${current}&limit=${newPageSize}`);
    };

    const handleViewDetail = (record) => {
        setViewProduct(record);
        setIsViewModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditProduct(record);
        setIsEditModalOpen(true);
        editForm.setFieldsValue(record);
    };

    const handleDelete = (productId) => {
        setDeleteProductId(productId);
        setIsDeleteModalOpen(true);
    };

    // Hàm xử lý khi chọn hàng
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
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
            width: '5%',
            render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            width: '25%',
            sorter: (a, b) => a.name.length - b.name.length,
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Loại',
            dataIndex: 'category',
            width: '15%',
            sorter: (a, b) => a.category.localeCompare(b.category),
            filters: categories.map(category => ({
                text: category.name,
                value: category._id,
            })),
            onFilter: (value, record) => record.category === value,
            render: (categoryId) => {
                const category = categories.find(cat => cat._id === categoryId);
                return category ? category.name : (categoryId || 'Không xác định');
            },
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            width: '10%',
            sorter: (a, b) => a.price - b.price,
            filters: [
                { text: ">= 100", value: ">=" },
                { text: "<= 100", value: "<=" }
            ],
            onFilter: (value, record) => {
                if (value === ">=") {
                    return record.price >= 100;
                } else {
                    return record.price <= 100;
                }
            }
        },
        {
            title: 'Còn lại',
            dataIndex: 'countInStock',
            width: '15%',
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            width: '10%',
            render: (image) => (
                image ? (
                    <img src={image} alt="product" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
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
                    <Button
                        type="link"
                        icon={<PlusCircleOutlined />}
                        onClick={() => handleStockImport(record)}
                        title="Nhập kho"
                        style={{ fontSize: "17px", color: "#52c41a" }}
                    />
                </div>
            ),
        },
    ];

    const dataSource = products.map((product) => ({
        key: product._id,
        name: product.name,
        category: product.category._id || product.category,
        price: product.price,
        description: product.description,
        image: product.image,
        countInStock: product.countInStock,
    }));

    const onFinish = (values) => {
        const productData = { ...values, image: stateProduct.image };
        mutationAdd.mutate(productData);
    };

    const onEditFinish = (values) => {
        const productData = {
            id: editProduct.key,
            ...values,
            image: editProduct.image,
            access_token
        };
        mutationUpdate.mutate(productData);
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

    const handleDeleteConfirm = () => {
        mutationDelete.mutate({ id: deleteProductId });
    };

    const handleDeleteSelected = () => {
        if (selectedRowKeys.length > 0) {
            setIsDeleteManyModalOpen(true);
        } else {
            toast.warning("Vui lòng chọn ít nhất một sản phẩm để xóa!");
        }
    };

    const handleDeleteManyConfirm = () => {
        mutationDeleteManyProduct.mutate({ ids: selectedRowKeys, access_token });
        setIsDeleteManyModalOpen(false);
    };

    const handleStockImport = (record) => {
        setStockImportProduct(record);
        setIsStockImportModalOpen(true);
        stockImportForm.setFieldsValue({
            productId: record.key,
            quantity: '',
            description: '',
        });
    };

    const handleStockImportOk = () => {
        stockImportForm.submit();
    };

    const handleStockImportCancel = () => {
        setIsStockImportModalOpen(false);
        setStockImportProduct(null);
        stockImportForm.resetFields();
    };

    const onStockImportFinish = (values) => {
        mutationStockImport.mutate(values);
    };

    return (
        <>
            <WrapperHeader>Quản lí sản phẩm</WrapperHeader>
            <ButtonAddUser onClick={handleOpenModalCreate}>
                <PlusSquareTwoTone style={{ fontSize: "50px" }} />
            </ButtonAddUser>
            <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                <Button
                    type="primary"
                    danger
                    onClick={handleDeleteSelected}
                    disabled={selectedRowKeys.length === 0}
                    style={{ marginBottom: "10px" }}
                >
                    Xóa các sản phẩm đã chọn
                </Button>
            </div>
            <div style={{ marginTop: "10px" }}>
                <TableComponent
                    columns={columns}
                    dataSource={dataSource}
                    rowSelection={rowSelection}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: totalProducts,
                        showSizeChanger: true,
                        pageSizeOptions: ['4', '5', '8'],
                        showTotal: () => null,
                    }}
                    onChange={handleTableChange}
                    loading={isTableLoading}
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
                </Loading>
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
                </Loading>
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
                                style={{ color: '#000' }}
                                dropdownStyle={{ pointerEvents: 'none' }}
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
                    <p style={{ textAlign: 'center', color: '#999', fontSize: '14px', padding: '20px 0' }}>
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
                <Loading isPending={isDeleting}>
                    <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
                </Loading>
            </Modal>

            {/* Modal xác nhận xóa nhiều sản phẩm */}
            <Modal
                title="Xác nhận xóa nhiều sản phẩm"
                open={isDeleteManyModalOpen}
                onOk={handleDeleteManyConfirm}
                onCancel={() => setIsDeleteManyModalOpen(false)}
                okText="Xóa"
                okType="danger"
                cancelText="Hủy"
            >
                <Loading isPending={isPending}>
                    <p>Bạn có chắc chắn muốn xóa các sản phẩm này không?</p>
                </Loading>
            </Modal>

            {/* Modal nhập kho sản phẩm */}
            <Modal
                title="Nhập kho sản phẩm"
                open={isStockImportModalOpen}
                onOk={handleStockImportOk}
                onCancel={handleStockImportCancel}
                okText="Nhập kho"
                cancelText="Hủy"
            >
                <Loading isPending={isStockImporting}>
                    <Form
                        form={stockImportForm}
                        name="stock-import"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        onFinish={onStockImportFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Tên sản phẩm"
                            name="productId"
                            hidden
                        >
                            <Input disabled />
                        </Form.Item>

                        <Form.Item
                            label="Tên sản phẩm"
                        >
                            <Input
                                value={stockImportProduct?.name}
                                disabled
                                style={{
                                    color: '#000',
                                    backgroundColor: '#fff',
                                    borderColor: '#d9d9d9',
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Số lượng"
                            name="quantity"
                        >
                            <Input placeholder="Nhập số lượng" />
                        </Form.Item>

                        <Form.Item
                            label="Mô tả"
                            name="description"
                        >
                            <TextArea placeholder="Nhập mô tả (không bắt buộc)" />
                        </Form.Item>
                    </Form>
                </Loading>
            </Modal>
        </>
    );
};

export default AdminProduct;