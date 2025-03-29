import { Input } from "antd";
import styled from "styled-components";

export const WrapperInputForm = styled(Input)`
    outline: none;
    border-top: none;
    border-radius: 0;
    border-left: none;
    border-right: none;
    padding-left: 0;
    &:focus{
        background: rgb(232,240,254);
    }
`