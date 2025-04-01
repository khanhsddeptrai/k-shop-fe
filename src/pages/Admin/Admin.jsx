import React, { useState, useEffect } from 'react';
import { AppstoreOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom'; // Thêm import
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';

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
        }
        return 'user'; // Mặc định
    };

    const [selectedKey, setSelectedKey] = useState(getInitialSelectedKey);

    // Cập nhật selectedKey khi URL thay đổi
    useEffect(() => {
        setSelectedKey(getInitialSelectedKey());
    }, [location.pathname]);

    const renderPage = (key) => {
        switch (key) {
            case 'user':
                return <AdminUser />;
            case 'product':
                return <AdminProduct />;
            default:
                return <></>;
        }
    };

    const handleOnClick = ({ key }) => {
        setSelectedKey(key);
        switch (key) {
            case 'product':
                navigate('/system/admin/products');
                break;
            case 'user':
                navigate('/system/admin/users');
                break;
            // case '3':
            //     navigate('/system/admin/3');
            //     break;
        }
    };

    const items = [
        { key: 'user', icon: <UserOutlined />, label: 'Người dùng' },
        { key: 'product', icon: <AppstoreOutlined />, label: 'Sản phẩm' },
        { key: '3', icon: <SettingOutlined />, label: 'Navigation Three' },
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
                <Menu
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
                    }}
                    items={items}
                    className="custom-menu"
                />
                <div style={{ padding: "0 15px" }}>
                    {renderPage(selectedKey)}
                </div>
            </div>

            <style jsx global>{`
                .custom-menu .ant-menu-item-selected {
                    border-right: 3px solid #1890ff !important;
                    border-radius: 0 !important;
                }
                .custom-menu .ant-menu-item {
                    margin-right: 0 !important;
                    border-radius: 0 !important;
                }
            `}</style>
        </>
    );
};

export default Admin;