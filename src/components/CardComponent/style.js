import { Card } from "antd";
import styled from "styled-components";

export const WrapperCardStyle = styled(Card)`
    width: 200px;
    & img {
      width: 200px;
      height: 200px;
      border-radius: 0px;
    }
`

export const WrapperNameProduct = styled.div`
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    color: rgb( 56, 56, 61);
`

export const WrapperReportText = styled.div`
    font-size: 10px;
    dissplay: flex;
    align-items: center;
    color: rgb( 128, 128, 137);    
    margin: 6px 0;
`

export const WrapperPrice = styled.div`
    font-size: 16px;
    font-weight: 500;
    color: rgb( 255, 66, 78);
    margin: 8px 0;
`

export const WrapperDiscount = styled.span`
    font-size: 12px;
    font-weight: 500;
    color: rgb( 255, 66, 78);
`

export const WrapperStyleTextSell = styled.span`
    color: rgb(120, 120, 120);
    fobt-size: 15px;
    line-height: 24px;
`