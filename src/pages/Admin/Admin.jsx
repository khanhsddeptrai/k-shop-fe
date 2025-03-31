import React, { useState } from 'react';
import { AppstoreOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';

const Admin = () => {
    const [stateOpenKeys, setStateOpenKeys] = useState(['product']);
    const [selectedKey, setSelectedKey] = useState('user');

    const renderPage = (key) => {
        switch (key) {
            case 'user':
                return <AdminUser />
            case 'product':
                return <AdminProduct />
            default:
                return <></>
        }
    }

    const handleOnClick = ({ key }) => {
        setSelectedKey(key);
        console.log('Selected key:', key);
    };

    const items = [
        {
            key: 'user',
            icon: <UserOutlined />,
            label: 'Người dùng',
        },
        {
            key: 'product',
            icon: <AppstoreOutlined />,
            label: 'Sản phẩm',
        },
        {
            key: '3',
            icon: <SettingOutlined />,
            label: 'Navigation Three',
        },
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
                    defaultSelectedKeys={['user']}
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

            {/* CSS inline để thêm border-right và loại bỏ border-radius */}
            <style jsx global>{`
                .custom-menu .ant-menu-item-selected {
                    border-right: 3px solid #1890ff !important;
                    border-radius: 0 !important; /* Loại bỏ border-radius */
                }
                .custom-menu .ant-menu-item {
                    margin-right: 0 !important; /* Loại bỏ margin mặc định */
                    border-radius: 0 !important; /* Loại bỏ border-radius cho tất cả item */
                }
            `}</style>
        </>
    );
};

export default Admin;