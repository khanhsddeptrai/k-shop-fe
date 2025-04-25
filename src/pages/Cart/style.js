import { InputNumber } from "antd";
import styled from "styled-components";

export const WrapperInputQuantity = styled(InputNumber)`
    width: 35px;
    margin: 0 5px;
    .ant-input-number-input {
        &:disabled {
            background: #fff !important;
            color: #000 !important;
            cursor: default !important;
        }
    }
`;