import React from 'react'
import { Button } from 'antd'
import { SearchOutlined } from "@ant-design/icons";
import { InputComponent } from '../InputComponent/InputComponent';

export const ButtonInputSearch = (props) => {
    const { size, placeholder, textButton } = props
    return (
        <div style={{ display: 'flex', background: "#fff" }}>
            <InputComponent
                style={{ borderRadius: '0px' }}
                size={size}
                placeholder={placeholder}
            />
            <Button
                style={{ border: "none", borderRadius: '0px', background: "rgb(13,92,182)", color: "#fff" }}
                size='large'
                icon={<SearchOutlined
                />}>
                {textButton}
            </Button>
        </div>
    )
}
