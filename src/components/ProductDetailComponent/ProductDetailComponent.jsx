import { Button, Col, Image, Row, InputNumber } from 'antd'
import React from 'react'
import giadodienthoai from '../../assets/images/gia-do-dien-thoai.webp'
import { WrapperAddressDeliver, WrapperPlusMinusButton, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQuantityProduct, WrapperStyleColImage, WrapperStyleNameProduct, WrapperStyleTextSell } from './style'
import { StarFilled, PlusOutlined, MinusOutlined } from '@ant-design/icons';

const ProductDetailComponent = () => {
    const onChange = value => { }

    return (
        <Row style={{ padding: "16px", background: "#fff", borderRadius: "4px" }}>
            <Col span={10} style={{ borderRight: "1px solid #e5e5e5", paddingRight: "10px" }}>
                <Image src={giadodienthoai} alt='image product' preview={false} />
                <Row style={{ paddingTop: "10px" }}>
                    <WrapperStyleColImage span={4}>
                        <Image src={giadodienthoai} alt='image product' preview={false} style={{ width: "65px" }} />
                    </WrapperStyleColImage>
                    <WrapperStyleColImage span={4}>
                        <Image src={giadodienthoai} alt='image product' preview={false} style={{ width: "65px" }} />
                    </WrapperStyleColImage>
                    <WrapperStyleColImage span={4}>
                        <Image src={giadodienthoai} alt='image product' preview={false} style={{ width: "65px" }} />
                    </WrapperStyleColImage>
                    <WrapperStyleColImage span={4}>
                        <Image src={giadodienthoai} alt='image product' preview={false} style={{ width: "65px" }} />
                    </WrapperStyleColImage>
                    <WrapperStyleColImage span={4}>
                        <Image src={giadodienthoai} alt='image product' preview={false} style={{ width: "65px" }} />
                    </WrapperStyleColImage>
                    <WrapperStyleColImage span={4}>
                        <Image src={giadodienthoai} alt='image product' preview={false} style={{ width: "65px" }} />
                    </WrapperStyleColImage>
                </Row>
            </Col>
            <Col span={14} style={{ paddingLeft: "10px" }}>
                <WrapperStyleNameProduct>Giá đỡ điện thoại bằng kim loại</WrapperStyleNameProduct>
                <div>
                    <StarFilled style={{ fontSize: "12px", color: "rgb(253,216,54)" }} />
                    <StarFilled style={{ fontSize: "12px", color: "rgb(253,216,54)" }} />
                    <StarFilled style={{ fontSize: "12px", color: "rgb(253,216,54)" }} />
                    <WrapperStyleTextSell>| Đã bán 1000+</WrapperStyleTextSell>
                </div>
                <WrapperPriceProduct>
                    <WrapperPriceTextProduct>150.000đ</WrapperPriceTextProduct>
                </WrapperPriceProduct>
                <WrapperAddressDeliver>
                    <span>Giao đến</span>
                    <span className='address'>3/2 Hưng Lợi, Ninh Kiều, Cần Thơ </span>
                    <span className='change-address'>- Đổi địa chỉ</span>
                </WrapperAddressDeliver>
                <div style={{
                    margin: "10px 0 20px", borderTop: "1px solid #e5e5e5",
                    borderBottom: "1px solid #e5e5e5",
                    padding: "10px 0",
                }}>
                    <div style={{ marginBottom: "6px" }}>Số lượng</div>
                    <WrapperQuantityProduct>
                        <WrapperPlusMinusButton
                            size='small'
                            icon={<MinusOutlined />}>
                        </WrapperPlusMinusButton>
                        <InputNumber
                            size='small'
                            style={{ width: "30px", height: "24px" }}
                            defaultValue={1}
                            onChange={onChange}
                        />
                        <WrapperPlusMinusButton
                            size='small'
                            icon={<PlusOutlined />}>
                        </WrapperPlusMinusButton>
                    </WrapperQuantityProduct>
                </div>
                <div style={{ display: "flex", gap: "12px", marginTop: "16px", alignItems: "center" }}>
                    <Button
                        style={{
                            border: "none",
                            borderRadius: '4px',
                            background: "rgb(255,57,69)",
                            color: "#fff",
                            width: "220px",
                            height: "48px",
                            fontWeight: "700",
                            fontSize: "15px",
                        }}
                        size='large'
                    >
                        Thêm vào giỏ hàng
                    </Button>
                    <Button
                        style={{
                            border: "1px solid rgb(13, 92, 182)",
                            borderRadius: '4px',
                            background: "#fff",
                            color: "rgb(13, 92, 182)",
                            width: "220px",
                            height: "48px",
                            fontWeight: "700",
                            fontSize: "15px",
                        }}
                        size='large'
                    >
                        Mua ngay
                    </Button>
                </div>
            </Col>
        </Row>
    )
}

export default ProductDetailComponent