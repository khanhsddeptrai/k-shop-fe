import React from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import { WrapperTypeProduct, WrapperLoadMoreButoon, WrapperProducts } from "./style";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import slider1 from "../../assets/images/slider1.jpg";
import slider2 from "../../assets/images/slider2.jpg";
import slider3 from "../../assets/images/slider3.jpg";
import CardComponent from "../../components/CardComponent/CardComponent";

const Home = () => {
    const typeProduct = ['TV', 'Laptop', 'Điện thoại', 'Máy ảnh', 'Máy lạnh', 'Máy giặt', 'Tủ lạnh'];
    return (
        <>
            <div style={{ padding: "0 120px", display: "flex" }}>
                <WrapperTypeProduct>
                    {typeProduct.map((item, index) => {
                        return <TypeProduct key={index} name={item} />;
                    })}
                </WrapperTypeProduct>
            </div>
            <div id="container" style={{ maxWidth: "1000px", background: "#efefef", padding: "0 210px", height: "1505px" }}>
                <SliderComponent arrImage={[slider1, slider2, slider3]} />
                <WrapperProducts>
                    <CardComponent />
                    <CardComponent />
                    <CardComponent />
                    <CardComponent />
                    <CardComponent />
                    <CardComponent />
                    <CardComponent />
                    <CardComponent />

                </WrapperProducts>
                <div style={{ textAlign: "center" }}>
                    <WrapperLoadMoreButoon color="primary" variant="outlined">
                        <span>Xem thêm</span>
                    </WrapperLoadMoreButoon>
                </div>
                {/* <div>
                    <NavbarComponent />
                </div> */}
            </div>

        </>

    )
}

export default Home;