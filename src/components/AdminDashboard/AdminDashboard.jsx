import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { getAllUser } from '../../services/UserService';
import { getAllProduct } from '../../services/ProductService';
import { getAllCategory } from '../../services/CategoryService';
import { getAllOrders } from '../../services/OrderService';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './AdminDashboard.css'

const { Title } = Typography;

const AdminDashboard = () => {
    const { access_token } = useSelector(state => state.user);
    const navigate = useNavigate();
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalCategories, setTotalCategories] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [orderData, setOrderData] = useState([]);
    const [productCategoryData, setProductCategoryData] = useState([]);

    // Dữ liệu cho các card với đường dẫn tương ứng
    const cardData = [
        { title: 'Người dùng', value: totalUsers, key: 'users', path: '/system/admin/users' },
        { title: 'Đơn hàng', value: totalOrders, key: 'orders', path: '/system/admin/orders' },
        { title: 'Danh mục', value: totalCategories, key: 'categories', path: '/system/admin/category' },
        { title: 'Sản phẩm', value: totalProducts, key: 'products', path: '/system/admin/products' },
    ];

    // Fetch tổng số người dùng
    const fetchTotalUsers = async () => {
        try {
            const response = await getAllUser({ page: 1, limit: 1 });
            setTotalUsers(response.totalUser || 0);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    // Fetch tổng số đơn hàng
    const fetchTotalOrders = async () => {
        try {
            const response = await getAllOrders(access_token);
            setTotalOrders(response.totalOrders || 0);

            // Lấy danh sách đơn hàng
            const orders = response.data || [];

            // Lấy 7 ngày gần nhất
            const today = new Date();
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 6); // Bao gồm cả hôm nay, tổng cộng 7 ngày

            // Tạo mảng chứa 7 ngày gần nhất dưới dạng chuỗi định dạng 'DD/MM'
            const dateRange = [];
            for (let i = 0; i < 7; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                const formattedDate = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
                dateRange.push(formattedDate);
            }
            dateRange.reverse(); // Đảo ngược để hiển thị từ ngày cũ đến ngày mới

            // Lọc đơn hàng trong 7 ngày gần nhất
            const filteredOrders = orders.filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate >= sevenDaysAgo && orderDate <= today;
            });

            // Đếm số đơn hàng theo ngày
            const orderCountByDate = filteredOrders.reduce((acc, order) => {
                const date = new Date(order.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
                acc[date] = (acc[date] || 0) + 1;
                return acc;
            }, {});

            // Tạo dữ liệu cho biểu đồ, đảm bảo tất cả 7 ngày đều có trong dữ liệu
            const chartData = dateRange.map(date => ({
                date,
                orders: orderCountByDate[date] || 0,
            }));

            setOrderData(chartData);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    // Fetch tổng số danh mục
    const fetchTotalCategories = async () => {
        try {
            const response = await getAllCategory();
            setTotalCategories(response.data?.length || 0);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    // Fetch tổng số sản phẩm và dữ liệu cho Bar Chart
    const fetchTotalProducts = async () => {
        try {
            const response = await getAllProduct({ page: 1, limit: 1000 });
            setTotalProducts(response.totalProduct || 0);

            // Tạo dữ liệu cho Bar Chart (số sản phẩm theo danh mục)
            const products = response.data || [];
            const categoriesResponse = await getAllCategory();
            const categories = categoriesResponse.data || [];

            const productCountByCategory = products.reduce((acc, product) => {
                const categoryId = product.category._id || product.category;
                acc[categoryId] = (acc[categoryId] || 0) + 1;
                return acc;
            }, {});

            const chartData = categories.map(category => ({
                name: category.name,
                products: productCountByCategory[category._id] || 0,
            }));
            setProductCategoryData(chartData);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    useEffect(() => {
        fetchTotalUsers();
        fetchTotalOrders();
        fetchTotalCategories();
        fetchTotalProducts();
    }, []);

    // Hàm xử lý chuyển hướng khi nhấp vào card
    const handleCardClick = (path) => {
        navigate(path);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Title level={3}>Dashboard</Title>
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                {cardData.map((card) => (
                    <Col xs={24} sm={12} md={6} key={card.key}>
                        <Card
                            hoverable
                            onClick={() => handleCardClick(card.path)}
                            title={card.title}
                            style={{ backgroundColor: 'rgb(26, 148, 255)', color: '#fff', width: "220px" }}
                            headStyle={{ color: '#fff', borderBottom: 'none' }}
                            bodyStyle={{ color: '#fff' }}
                        >
                            <Title level={2} style={{ color: '#fff', margin: 0 }}>{card.value}</Title>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card title="Đơn hàng trong 7 ngày qua">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={orderData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="orders" stroke="#1890ff" fill="#1890ff" fillOpacity={0.3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Sản phẩm theo danh mục">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={productCategoryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="products" fill="#1890ff" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboard;