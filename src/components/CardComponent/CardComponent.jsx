import React from 'react';
import {
    WrapperNameProduct, WrapperReportText, WrapperPrice, WrapperDiscount,
    WrapperCardStyle, OutOfStockLabel,
    WrapperStyleTextSell
} from './style';
import { StarFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const CardComponent = (props) => {
    const { countInStock, description, image, name, price, category, discount, rating, id } = props;
    const navigate = useNavigate();
    const isOutOfStock = countInStock === 0;

    const handleDetailProduct = (id) => {
        navigate(`/product-detail/${id}`);
    };

    return (
        <WrapperCardStyle
            hoverable
            style={{
                width: 180,
                padding: '10px',
                opacity: isOutOfStock ? 0.6 : 1, // Dim when out of stock
                cursor: 'pointer', // Keep cursor clickable
            }}
            cover={
                <>
                    {isOutOfStock && <OutOfStockLabel>Hết hàng</OutOfStockLabel>}
                    <img alt={name} src={image} />
                </>
            }
            onClick={() => handleDetailProduct(id)}
        >
            <WrapperNameProduct>{name}</WrapperNameProduct>
            <WrapperReportText>
                <span style={{ marginRight: '4px' }}>
                    <span style={{ fontSize: '12px' }}>{rating || 4.5}</span>
                    <StarFilled style={{ fontSize: '12px', color: 'rgb(253,216,54)' }} />
                </span>
                <WrapperStyleTextSell>| Đã bán 1000+</WrapperStyleTextSell>
            </WrapperReportText>
            <WrapperPrice>
                <span style={{
                    marginRight: '8px',
                    color: isOutOfStock ? '#8c8c8c' : 'inherit', // Gray price when out of stock

                }}>
                    {price.toLocaleString('vi-VN')}đ
                </span>
                <WrapperDiscount>
                    {discount > 0 ? `-${discount}%` : ''}
                </WrapperDiscount>
            </WrapperPrice>
        </WrapperCardStyle>
    );
};

export default CardComponent;