import React from 'react'
import { Input } from 'antd'

export const InputComponent = ({ size, placeholder, borderd, style, ...rests }) => {
    return (
        <Input
            bordered={borderd}
            style={style}
            size={size}
            placeholder={placeholder}
            {...rests}
        />
    )
}
