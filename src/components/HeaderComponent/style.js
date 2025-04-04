import { Row } from "antd"
import styled from "styled-components"

export const WrapperHeader = styled(Row)`
    padding: 10px 130px;
    background-color: rgb(26,148,255);
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: nowrap;
`

export const WrapperTextHeader = styled.a`
    color: white;
    font-size: 18px;
    font-weight: bold;
    text-align: left;
    text-decoration: none;
    cursor: pointer;
    &:hover{
        color: white !important;
    }
`

export const WrapperHeaderAccount = styled.div`
    display: flex;
    align-items: center;
    color: #fff;
    gap: 10px;
`

export const WrapperContentPopover = styled.p`
    cursor: pointer;
    margin: 0;
    padding: 5px 10px;
    &:hover {
        background-color: #f0f0f0;
        color: rgb(26,148,255);
    }
`


