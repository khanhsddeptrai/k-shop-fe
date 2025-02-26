import React from 'react'
import { WrapperLabelText, WrapperTextValue, WrapperContent } from './style'
import { Checkbox, Rate } from 'antd'

const NavbarComponent = () => {
    const onChange = () => { }
    const renderContent = (type, options) => {
        switch (type) {
            case 'text':
                return options.map((option) => {
                    return (
                        <WrapperTextValue>{option}</WrapperTextValue>
                    )
                })
            case 'checkbox':
                return (
                    <Checkbox.Group
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                        onChange={onChange}
                    >
                        {options.map((option) => {
                            return (
                                <Checkbox value={option.value}>{option.label}</Checkbox>
                            )
                        })}
                    </Checkbox.Group>
                )
            case 'start':
                return (
                    options.map((option) => {
                        return (
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: "12px", gap: "8px" }}>
                                <Rate style={{ fontSize: "14px" }} allowHalf defaultValue={option} />
                                <span>Từ {option} sao</span>
                            </div>
                        )
                    })
                )

            case 'price':
                return (
                    options.map((option) => {
                        return (
                            <div style={{
                                borderRadius: "30px",
                                backgroundColor: "gray",
                                width: "150px",
                                padding: "4px",
                                fontSize: "12px",
                                color: "rgb(56,56,61)",
                            }}>
                                {option}
                            </div>
                        )
                    })
                )
            default:
                return []
        }
    }
    return (
        <div>
            <WrapperLabelText>Danh mục</WrapperLabelText>
            <WrapperContent>
                {renderContent('text', ['Điện thoại', 'Máy tính', 'Máy ảnh', 'Máy giặt', 'Tủ lạnh'])}
                {renderContent('checkbox', [
                    { label: 'A', value: 'A' },
                    { label: 'B', value: 'B' },
                    { label: 'C', value: 'C' }
                ])}
                {renderContent('start', [3, 4, 5])}
                {renderContent('price', ["400.000đ - 1.000.000đ", "1.000.000đ - 2.000.000đ", "Trên 2.000.000đ"])}
            </WrapperContent>

        </div>
    )
}

export default NavbarComponent