import React from 'react'
import Slider from 'react-slick'
import { Image } from 'antd';
import { WrapperStyleSlider } from './style';

const SliderComponent = ({ arrImage }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000

    };
    return (
        <WrapperStyleSlider {...settings} >
            {arrImage.map((item) => {
                return (
                    <Image preview={false} src={item} alt="slider" style={{ width: "100%", height: "275px" }} />
                )
            })}
        </WrapperStyleSlider>
    )
}

export default SliderComponent