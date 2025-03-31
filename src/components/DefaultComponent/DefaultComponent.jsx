import React from "react";
import HeaderComponent from "../HeaderComponent/HeaderComponent";

const DefaultComponent = ({ children }) => {
    return (
        <div>
            <HeaderComponent isHiddenSearch={false} isHiddenCart={false} />
            {children}
        </div>
    )
}
export default DefaultComponent;