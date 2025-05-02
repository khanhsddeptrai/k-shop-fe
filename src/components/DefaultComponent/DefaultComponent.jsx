import React from "react";
import HeaderComponent from "../HeaderComponent/HeaderComponent";
import FooterComponent from "../FooterComponent/FooterComponent";

const DefaultComponent = ({ children }) => {
    return (
        <div style={{ minHeight: "100vh" }} >
            <HeaderComponent isHiddenSearch={false} isHiddenCart={false} />
            <div style={{ padding: '0 20px' }}>{children}</div>
            <FooterComponent />
        </div>
    )
}
export default DefaultComponent;