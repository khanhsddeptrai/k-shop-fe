import React from 'react'
import {
    WrapperNameProduct, WrapperReportText, WrapperPrice, WrapperDiscount,
    WrapperCardStyle,
    WrapperStyleTextSell

} from './style';
import { StarFilled } from '@ant-design/icons';

const CardComponent = () => {
    return (
        <WrapperCardStyle
            hoverable
            style={{ width: 190, padding: "10px" }}
            cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
        >
            <WrapperNameProduct>Iphone 15</WrapperNameProduct>
            <WrapperReportText>
                <span style={{ marginRight: "4px" }}>
                    <span style={{ fontSize: "12px" }}>4.5</span>
                    <StarFilled style={{ fontSize: "12px", color: "rgb(253,216,54)" }} />
                </span>
                <WrapperStyleTextSell>| Đã bán 1000+</WrapperStyleTextSell>
            </WrapperReportText>
            <WrapperPrice>
                <span style={{ marginRight: "8px" }}>1.000.000đ</span>
                <WrapperDiscount>
                    -6%
                </WrapperDiscount>
            </WrapperPrice>
        </WrapperCardStyle>
    )
}

export default CardComponent