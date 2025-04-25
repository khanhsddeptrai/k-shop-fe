import { Button, Col } from "antd";
import styled from "styled-components";
import { InputNumber } from "antd";

export const WrapperStyleColImage = styled(Col)`
    flex-bacis: unset;
    display: flex;
`

export const WrapperStyleNameProduct = styled(Col)`
    color: rgb(36, 36, 36);
    font-size: 24px;
    font-weight: 300;
    line-height: 32px;
    word-break: break-word;
`

export const WrapperStyleTextSell = styled.span`
    color: rgb(120, 120, 120);
    fobt-size: 15px;
    line-height: 24px;
`

export const WrapperPriceProduct = styled.span`
    background: rgb(250, 250, 250);
    border-radius: 4px;
`

export const WrapperPriceTextProduct = styled.span`
    font-size: 32px;
    lei-height: 40px;
    margin-right: 8px;
    font-weight: 500;
    padding: 10px;
    margin-top: 10px;
`

export const WrapperAddressDeliver = styled.div`
    margin-top: 10px;
    margin-bottom: 15px;
    span.address{
        text-decoration: underline;
        font-size: 15px;
        lei-height: 24px;   
        font-weight: 500;
        whtie-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    span.change-address{
        color: rgb(11, 116, 229);
        font-size: 16px;
        line-height: 24px;
        font-weight: 500;
        flex-shrink: 0;
    }
`


export const WrapperQuantityProduct = styled.div`
    display: flex;
    gap; 4px;
    align-items: center;
    justify-content: space-between;
    width: 80px;
    margin-bottom: 12px;
    border-radius: 4px;
`

export const WrapperPlusMinusButton = styled(Button)`
    border: 1px solid #ccc;
    border-radius: 4px;
    background: transparent;
    color: #000;
   
`

export const WrapperInputNumberQuantity = styled(InputNumber)`
    width: 30px;
    height: 24px;

    &.ant-input-number.ant-input-number-sm {
        .ant-input-number-handler-wrap {
            display: none !important;
        }
    }
`;