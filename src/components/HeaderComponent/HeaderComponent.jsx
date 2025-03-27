import React from "react";
import { Badge, Col } from 'antd';
import { WrapperHeader, WrapperHeaderAccount, WrapperTextHeader } from "./style";
// import Search from "antd/es/transfer/search";
import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { ButtonInputSearch } from "../ButtonInputSearch/ButtonInputSearch";
import { useNavigate } from "react-router-dom";
import { use } from "react";
import { useSelector } from "react-redux";



const HeaderComponent = () => {
    const user = useSelector(state => state.user)
    console.log(user)
    const naviagte = useNavigate();
    const handleNavigateLogin = () => {
        naviagte('/sign-in')
    }

    return (
        <div>
            <WrapperHeader>
                <Col span={4}>
                    <WrapperTextHeader>K-SHOP</WrapperTextHeader>
                </Col>
                <Col span={12}>
                    <ButtonInputSearch size="large" placeholder="Tìm sản phẩm" textButton="Tìm kiếm" />
                </Col>
                <Col span={8}>
                    <WrapperHeaderAccount>
                        <UserOutlined style={{ fontSize: "30px" }} />
                        {user?.name ? <div>{user.name}</div>
                            :
                            <div style={{ marginRight: "20px" }}>
                                <span
                                    style={{ cursor: "pointer" }}
                                    onClick={handleNavigateLogin}
                                >Đăng nhập/ Đăng ký
                                </span>
                                <div>
                                    <span
                                        style={{ cursor: "pointer" }}
                                    >
                                        Tài khoản
                                    </span>
                                    <CaretDownOutlined />
                                </div>
                            </div>}

                        <WrapperHeaderAccount >
                            <Badge count={5} size="small">
                                <ShoppingCartOutlined style={{ fontSize: "30px", color: "#fff" }} />
                            </Badge>
                            <span>Giỏ hàng</span>
                        </WrapperHeaderAccount>

                    </WrapperHeaderAccount>
                </Col>
            </WrapperHeader>
        </div>
    )
}
export default HeaderComponent;