import React, { useEffect } from 'react'
import ProductDetailComponent from '../../components/ProductDetailComponent/ProductDetailComponent'
import { useParams } from 'react-router-dom'

const ProductDetail = () => {
    const { id } = useParams()
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);
    return (
        <div style={{ padding: "0 120px", background: "#efefef", height: "1000px" }}>
            <span>Chi tiết sản phẩm</span>
            <ProductDetailComponent productId={id} />
        </div>
    )
}

export default ProductDetail