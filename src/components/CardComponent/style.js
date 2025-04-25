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
    font-size: 13px;
    font-weight: 500;
    line-height: 16px;
    height: 20px;
    margin-bottom: 10px;
    color: rgb( 56, 56, 61);
    display: -webkit-box;
    -webkit-line-clamp: 2; /* Limit to 2 lines */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4; /* Adjust for better spacing */
    height: 2.8em; /* Approximately 2 lines height (1.4em * 2) */
`

export const WrapperReportText = styled.div`
    font-size: 10px;
    dissplay: flex;
    align-items: center;
    color: rgb( 128, 128, 137);    
   
`

export const WrapperPrice = styled.div`
    font-size: 18px;
    font-weight: 500;
    color: rgb( 255, 66, 78);
    margin-top:5px;
    
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

export const OutOfStockLabel = styled.div`
    position: absolute;
    top: 4px;
    left: 4px;
    background-color: #f5222d;
    color: #fff;
    padding: 1px 4px;
    border-radius: 6px !important;
    font-size: 12px;
    font-weight: 500;
    z-index: 1;
    line-height: 1.5;
    max-width: 60px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 20px;
    text-align: center;
`