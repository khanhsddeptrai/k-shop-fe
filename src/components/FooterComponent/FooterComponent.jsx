import React from "react";
import { Row, Col } from "antd";
import { MessageFilled, CommentOutlined } from "@ant-design/icons";
import styled from "styled-components";

// Styled components để tùy chỉnh giao diện
const FooterWrapper = styled.div`
    background: #f5f5f5;
    padding: 40px 120px;
    color: #333;
    font-size: 14px;
    border-top: 1px solid #e5e5e5;
    clear: both; /* Đảm bảo footer không bị ảnh hưởng bởi float */
`;

const FooterTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const FooterLink = styled.a`
  display: block;
  color: #333;
  margin-bottom: 8px;
  &:hover {
    color: #1890ff;
    text-decoration: underline;
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding: 16px 0;
  border-top: 1px solid #e5e5e5;
  margin-top: 24px;
  color: #666;
`;

const FooterContent = styled.div`
  min-height: 150px; /* Đảm bảo các cột có chiều cao tối thiểu để cân đối */
`;

const FooterComponent = () => {
  return (
    <FooterWrapper>
      <Row gutter={[16, 16]} style={{ display: "flex", justifyContent: "space-between" }}>
        <Col xs={24} sm={12} md={10}>
          <FooterContent>
            <FooterTitle>Về K-SHOP</FooterTitle>
            <p>
              K-SHOP chuyên cung cấp các sản phẩm phụ kiện công nghệ, gia dụng thông minh nhằm cung cấp góc làm việc thú
              vị, cùng như một không gian sống đầy tiện nghi với các sản phẩm thông minh.
            </p>
            <p>
              <strong>Địa chỉ:</strong> 91/19f An Thới, Bình Thủy, Cần Thơ
            </p>
            <p>
              <strong>Hotline:</strong> 09194022101
            </p>
            <p>
              <strong>Email:</strong> kshop141@gmail.com
            </p>
          </FooterContent>
        </Col>

        <Col xs={24} sm={12} md={7}>
          <FooterContent>
            <FooterTitle>Liên kết</FooterTitle>
            <FooterLink href="/">Trang chủ</FooterLink>
            <FooterLink >Sản phẩm</FooterLink>
            <FooterLink>Pre-order</FooterLink>
            <FooterLink>Liên hệ</FooterLink>
            <FooterLink>Tin tức</FooterLink>
          </FooterContent>
        </Col>

        <Col xs={24} sm={12} md={7}>
          <FooterContent>
            <FooterTitle>Chính sách</FooterTitle>
            <FooterLink >Chính sách đổi trả</FooterLink>
            <FooterLink>Chính sách bảo mật</FooterLink>
            <FooterLink >Chính sách vận chuyển</FooterLink>
            <FooterLink >Hướng dẫn mua hàng</FooterLink>
            <FooterLink >Hướng dẫn thanh toán</FooterLink>
          </FooterContent>
        </Col>
      </Row>

      {/* Copyright */}
      <Copyright>Copyright © 2025 K-SHOP - Chuyên cung cấp các sản phẩm phụ kiện công nghệ.</Copyright>
    </FooterWrapper>
  );
};

export default FooterComponent;