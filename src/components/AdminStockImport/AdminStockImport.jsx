import React, { useState, useEffect } from 'react';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Modal, Form, Input } from 'antd';
import TableComponent from '../TableComponent/TableComponent';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import { getAllStockImport } from '../../services/StockImportService';
const { TextArea } = Input;

const StockImportHistory = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const getQueryParams = () => {
        const params = new URLSearchParams(location.search);
        return {
            page: parseInt(params.get('page')) || 1,
            limit: parseInt(params.get('limit')) || 5,
        };
    };

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewStockImport, setViewStockImport] = useState(null);
    const [stockImports, setStockImports] = useState([]);
    const [totalStockImports, setTotalStockImports] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(getQueryParams().page);
    const [pageSize, setPageSize] = useState(getQueryParams().limit);
    const [isTableLoading, setIsTableLoading] = useState(false);

    const fetchStockImports = async (page = currentPage, limit = pageSize) => {
        setIsTableLoading(true);
        try {
            const response = await getAllStockImport({ page, limit });
            setStockImports(response.data || []);
            setTotalStockImports(response.totalStockImports || 0);
            setTotalPages(response.totalPage || 0);
            setCurrentPage(response.currentPage || page);
        } catch (error) {
            console.error('Failed to fetch stock imports:', error);
            toast.error('Không thể tải lịch sử nhập kho');
            setStockImports([]);
        } finally {
            setIsTableLoading(false);
        }
    };

    useEffect(() => {
        const { page, limit } = getQueryParams();
        setCurrentPage(page);
        setPageSize(limit);
        fetchStockImports(page, limit);
    }, [location.search]);

    const handleTableChange = (pagination) => {
        const { current, pageSize: newPageSize } = pagination;
        setCurrentPage(current);
        setPageSize(newPageSize);
        navigate(`/system/admin/stock-import-history?page=${current}&limit=${newPageSize}`);
    };

    const handleViewDetail = (record) => {
        setViewStockImport(record);
        setIsViewModalOpen(true);
    };

    const handleViewCancel = () => {
        setIsViewModalOpen(false);
        setViewStockImport(null);
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            width: '10%',
            render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'productName',
            width: '30%',
            sorter: (a, b) => a.productName.localeCompare(b.productName),
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Số lượng nhập',
            dataIndex: 'quantity',
            width: '15%',
            sorter: (a, b) => a.quantity - b.quantity,
        },
        {
            title: 'Ngày nhập',
            dataIndex: 'createdAt',
            width: '25%',
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            render: (date) => new Date(date).toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            })
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
                </div>
            ),
        },
    ];

    const dataSource = stockImports.map((stockImport, index) => ({
        key: stockImport._id,
        index: index + 1,
        productName: stockImport.productId?.name || 'Không xác định',
        quantity: stockImport.quantity,
        createdAt: stockImport.createdAt,
        description: stockImport.description,
    }));

    return (
        <>
            <h2>Lịch sử nhập kho</h2>
            <div style={{ marginTop: '20px' }}>
                <TableComponent
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: totalStockImports,
                        showSizeChanger: true,
                        pageSizeOptions: ['5', '10', '20'],
                        showTotal: () => null,
                    }}
                    onChange={handleTableChange}
                    loading={isTableLoading}
                />
            </div>

            {/* Modal xem chi tiết nhập kho */}
            <Modal
                title="Chi tiết nhập kho"
                open={isViewModalOpen}
                onOk={handleViewCancel}
                onCancel={handleViewCancel}
                okText="Đóng"
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                {viewStockImport ? (
                    <Form
                        name="view"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        autoComplete="off"
                    >
                        <Form.Item label="Tên sản phẩm">
                            <Input
                                value={viewStockImport.productName || 'Không xác định'}
                                disabled
                                style={{
                                    color: '#000',
                                    backgroundColor: '#fff',
                                    borderColor: '#d9d9d9',
                                }}
                            />
                        </Form.Item>

                        <Form.Item label="Số lượng nhập">
                            <Input
                                value={viewStockImport.quantity || 'Không có'}
                                disabled
                                style={{
                                    color: '#000',
                                    backgroundColor: '#fff',
                                    borderColor: '#d9d9d9',
                                }}
                            />
                        </Form.Item>

                        <Form.Item label="Ngày nhập">
                            <Input
                                value={
                                    viewStockImport?.createdAt
                                        ? new Date(viewStockImport.createdAt).toLocaleString('vi-VN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                        })
                                        : 'Không có'
                                }
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
                                value={viewStockImport.description || 'Không có'}
                                disabled
                                style={{
                                    color: '#000',
                                    backgroundColor: '#fff',
                                    borderColor: '#d9d9d9',
                                }}
                            />
                        </Form.Item>
                    </Form>
                ) : (
                    <p style={{ textAlign: 'center', color: '#999', fontSize: '14px', padding: '20px 0' }}>
                        Không có dữ liệu nhập kho
                    </p>
                )}
            </Modal>
        </>
    );
};

export default StockImportHistory;