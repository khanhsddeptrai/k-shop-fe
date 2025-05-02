import { Row } from "antd"
import styled from "styled-components"

export const WrapperHeader = styled(Row)`
    padding: 10px 15px;
    background-color: rgb(26,148,255);
    display: flex;
    align-items: center;
    flex-wrap: nowrap;

`

export const WrapperTextHeader = styled.a`
    margin-left: 17px;
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
    margin-left: 15px;
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

export const SuggestionsWrapper = styled.div`
    max-height: 300px;
    overflow-y: auto;
    width: 450px;
    background: #fff;
    border-radius: 4px;
    z-index: 1000;
    position: relative;
`;

export const SuggestionItem = styled.div`
    padding: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
    &:hover {
        background: #f5f5f5;
    }
`;

export const SuggestionImage = styled.img`
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 4px;
`;

