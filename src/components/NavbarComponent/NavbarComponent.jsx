import React from 'react';
import { Checkbox } from 'antd';
import { PriceOption, WrapperContent, WrapperLabelText } from './style';


const NavbarComponent = () => {
    const onChange = (e) => {
        console.log(`checked = ${e.target.checked}`);
        // Bạn có thể thêm logic xử lý khi checkbox được chọn tại đây
    };

    const priceOptions = [
        'Dưới 1.000.000đ',
        '1.000.000đ - 2.000.000đ',
        '2.000.000đ - 3.000.000đ',
        '3.000.000đ - 4.000.000đ',
        'Trên 4.000.000đ',
    ];

    const renderContent = (type, options) => {
        switch (type) {
            case 'price':
                return options.map((option, index) => (
                    <PriceOption key={index}>
                        <Checkbox onChange={onChange} />
                        <span style={{ marginLeft: '8px' }}>{option}</span>
                    </PriceOption>
                ));
            default:
                return [];
        }
    };

    return (
        <div>
            <WrapperLabelText>Lọc giá</WrapperLabelText>
            <WrapperContent>
                {renderContent('price', priceOptions)}
            </WrapperContent>
        </div>
    );
};

export default NavbarComponent;