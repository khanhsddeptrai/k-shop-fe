import { Button, Upload } from "antd";
import styled from "styled-components";

export const WrapperProfileHeader = styled.h1`
    color: #000;
    font-size: 18px;
    margin: 4px 0;
`

export const WrapperContainerContent = styled.div`
    margin: 0 auto; 
    border: 1px solid #ccc;
    width: 600px;
    border-radius: 10px;
    padding: 10px 0;
`

export const WrapperProfileContent = styled.div`
    display: flex;
    flex-direction: column;
    width: 500px;
    margin: 0 auto;
    padding: 15px;
    border-radius: 10px;
`
export const WrapperInput = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`
export const WrapperLabel = styled.label`
    color: #000;
    font-size: 12px;
    line-height: 30px;
    font-weight: 600;
    width: 120px;
`

export const WrapperButtonUpdate = styled(Button)`
    height: 30px;
    border: 1px solid rgb(26,148,255);
    border-radius: 4px;
    color: rgb(26,148,255);
    width: fit-content;
    margin-top: 10px;
    &:hover {
        background: rgb(26,148,255) !important;
        color: #fff !important;
    }
`

export const WrapperUploadAvatar = styled(Upload)`
    & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
        width: 60px;
        height: 60px;
        border-radius: 50%;
    }
    & .ant-upload-list-item-info {
        display: none !important;    
    }

`

