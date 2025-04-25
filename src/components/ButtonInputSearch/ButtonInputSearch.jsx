import React from 'react';
import { Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { InputComponent } from '../InputComponent/InputComponent';

export const ButtonInputSearch = ({ size, placeholder, textButton, value, onChange, onSearch }) => {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch();
        }
    };

    return (
        <div style={{ display: 'flex', background: '#fff' }}>
            <InputComponent
                style={{ borderRadius: '0px' }}
                size={size}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyPress={handleKeyPress}
            />
            <Button
                style={{ border: 'none', borderRadius: '0px', background: 'rgb(13,92,182)', color: '#fff' }}
                size={size}
                icon={<SearchOutlined />}
                onClick={onSearch}
            >
                {textButton}
            </Button>
        </div>
    );
};