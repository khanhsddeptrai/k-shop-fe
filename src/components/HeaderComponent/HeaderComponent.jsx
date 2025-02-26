import React from "react";
import { Badge, Col } from 'antd';
import { WrapperHeader, WrapperHeaderAccount, WrapperTextHeader } from "./style";
import Search from "antd/es/transfer/search";
import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { ButtonInputSearch } from "../ButtonInputSearch/ButtonInputSearch";

const HeaderComponent = () => {
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
                        <div style={{ marginRight: "20px" }}>
                            <span>Đăng nhập/ Đăng ký</span>
                            <div>
                                <span>Tài khoản</span>
                                <CaretDownOutlined />
                            </div>
                        </div>
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