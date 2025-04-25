import React, { useState, useEffect } from 'react';
import { BarsOutlined, BorderOuterOutlined, FormOutlined, HomeOutlined, MinusSquareOutlined, ProductOutlined, UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom'; // Thêm import
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import AdminStockImport from '../../components/AdminStockImport/AdminStockImport';
import AdminCategory from '../../components/AdminCategory/AdminCategory';
import AdminOrders from '../../components/AdminOrders/AdminOrders';
import AdminDashboard from '../../components/AdminDashboard/AdminDashboard';
import { WrapperRowSelected } from './style';
import AdminVoucher from '../../components/AdminVoucher/AdminVoucher';

const Admin = () => {
    const location = useLocation(); // Lấy thông tin URL
    const navigate = useNavigate();   // Để điều hướng
    const [stateOpenKeys, setStateOpenKeys] = useState(['product']);

    // Khởi tạo selectedKey dựa trên URL
    const getInitialSelectedKey = () => {
        if (location.pathname.includes('/system/admin/product')) {
            return 'product';
        } else if (location.pathname.includes('/system/admin/users')) {
            return 'user';
        } else if (location.pathname.includes('/system/admin/stock-import')) {
            return 'stock-import';
        } else if (location.pathname.includes('/system/admin/category')) {
            return 'category';
        } else if (location.pathname.includes('/system/admin/orders')) {
            return 'orders';
        } else if (location.pathname.includes('/system/admin/voucher')) {
            return 'voucher';
        }

        return 'dashboard'; // Mặc định
    };

    const [selectedKey, setSelectedKey] = useState(getInitialSelectedKey);

    // Cập nhật selectedKey khi URL thay đổi
    useEffect(() => {
        setSelectedKey(getInitialSelectedKey());
    }, [location.pathname]);

    const renderPage = (key) => {
        switch (key) {
            case 'dashboard':
                return <AdminDashboard />;
            case 'user':
                return <AdminUser />;
            case 'product':
                return <AdminProduct />;
            case 'stock-import':
                return <AdminStockImport />;
            case 'category':
                return <AdminCategory />;
            case 'orders':
                return <AdminOrders />;
            case 'voucher':
                return <AdminVoucher />;
            default:
                return <></>;
        }
    };

    const handleOnClick = ({ key }) => {
        setSelectedKey(key);
        switch (key) {
            case 'dashboard':
                navigate('/system/admin/dashboard');
                break;
            case 'product':
                navigate('/system/admin/products');
                break;
            case 'user':
                navigate('/system/admin/users');
                break;
            case 'stock-import':
                navigate('/system/admin/stock-import');
                break;
            case 'category':
                navigate('/system/admin/category');
                break;
            case 'orders':
                navigate('/system/admin/orders');
                break;
            case 'voucher':
                navigate('/system/admin/voucher');
                break;
        }
    };

    const items = [
        { key: 'dashboard', icon: <HomeOutlined />, label: 'Quản lí chung' },
        { key: 'user', icon: <UserOutlined />, label: 'Người dùng' },
        { key: 'product', icon: <ProductOutlined />, label: 'Sản phẩm' },
        { key: 'stock-import', icon: <FormOutlined />, label: 'Chi tiết nhập kho' },
        { key: 'category', icon: <BarsOutlined />, label: 'Danh mục sản phẩm' },
        { key: 'orders', icon: <BorderOuterOutlined />, label: 'Đơn hàng' },
        { key: 'voucher', icon: <MinusSquareOutlined />, label: 'Mã giảm giá' }
    ];

    const getLevelKeys = (items1) => {
        const key = {};
        const func = (items2, level = 1) => {
            items2.forEach((item) => {
                if (item.key) {
                    key[item.key] = level;
                }
                if (item.children) {
                    func(item.children, level + 1);
                }
            });
        };
        func(items1);
        return key;
    };
    const levelKeys = getLevelKeys(items);

    const onOpenChange = (openKeys) => {
        const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
        if (currentOpenKey !== undefined) {
            const repeatIndex = openKeys
                .filter((key) => key !== currentOpenKey)
                .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
            setStateOpenKeys(
                openKeys
                    .filter((_, index) => index !== repeatIndex)
                    .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
            );
        } else {
            setStateOpenKeys(openKeys);
        }
    };

    return (
        <>
            <HeaderComponent isHiddenSearch={true} isHiddenCart={true} />
            <div style={{ display: 'flex' }}>
                <WrapperRowSelected
                    mode="inline"
                    openKeys={stateOpenKeys}
                    onOpenChange={onOpenChange}
                    onClick={handleOnClick}
                    selectedKeys={[selectedKey]}
                    style={{
                        width: 240,
                        boxShadow: '1px 1px 2px #ccc',
                        height: '100vh',
                        borderRight: 'none',
                        background: ''
                    }}
                    items={items}
                    className="custom-menu"
                />
                <div style={{ padding: "0 15px" }}>
                    {renderPage(selectedKey)}
                </div>
            </div>
        </>
    );
};

export default Admin;