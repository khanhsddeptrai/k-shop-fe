import { Button } from "antd";
import styled from "styled-components";

export const WrapperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    gap: 25px;
    justify-content: flex-start;
    border-bottom: 1px solid #e5e5e5;
    height: 44px;
    background-color: #fff;
    margin-left: -20px; 
    margin-right: -20px; 
    width: calc(100% + 40px);
    padding: 0 20px;
    
`

export const WrapperLoadMoreButoon = styled(Button)`
    width: 100px;
    height: 35px;
    padding: 4px;
    fontSize: 12px;
    font-weight: 500;
    &: hover {
        background-color: rgb(13,92,182) !important;
        transform: scale(1.05); 
  
    }
    &:hover span {
        color: white;
    }
    &:disabled {
    pointer-events: none; /* Ngăn mọi sự kiện chuột */
  }

`

export const WrapperProducts = styled.div`
    display: flex;
    flex-wrap: wrap;
    padding: 10px 15px;
    gap: 15px;
    align-items: center;
    margin-top: 20px;
   
`