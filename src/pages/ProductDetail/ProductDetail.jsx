import React from 'react'
import ProductDetailComponent from '../../components/ProductDetailComponent/ProductDetailComponent'

const ProductDetail = () => {
    return (
        <div style={{ padding: "0 120px", background: "#efefef", height: "1000px" }}>
            <span>Chi tiết sản phẩm</span>
            <ProductDetailComponent />
        </div>
    )
}

export default ProductDetail