import React, { useState } from "react";
import { useParams } from "react-router-dom";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Row, Col, Pagination } from "antd";
import { WrapperProducts, WrapperNavbar } from "./style";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading/Loading";

const TypeProducts = () => {
    const { categoryId } = useParams();
    const [page, setPage] = useState(1);
    const [limit] = useState(4);
    const fetchProductsByCategory = async () => {
        const res = await ProductService.getAllProduct({
            page,
            limit,
            categoryId: categoryId
        });
        return res;
    };
    const { isPending, data: products } = useQuery({
        queryKey: ["products", categoryId, page, limit],
        queryFn: fetchProductsByCategory,
        retry: 3,
        retryDelay: 1000,
        keepPreviousData: true,
    });

    // Xử lý thay đổi trang
    const onChangePage = (newPage) => {
        setPage(newPage);
    };

    return (
        <div style={{ width: "100%", background: "#efefef" }}>
            <div style={{ width: "1250px", margin: "0 auto" }}>
                <Row style={{ padding: "0 120px 15px 120px", background: "#efefef", flexWrap: "nowrap", paddingTop: "10px" }}>
                    <WrapperNavbar span={5} style={{ borderRadius: "4px", marginRight: "20px" }}>
                        <NavbarComponent />
                    </WrapperNavbar>
                    <WrapperProducts span={19}>
                        <Loading isPending={isPending}>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                                {products?.data?.length > 0 ? (
                                    products.data.map((product) => (
                                        <CardComponent
                                            key={product._id}
                                            countInStock={product.countInStock}
                                            description={product.description}
                                            image={product.image}
                                            name={product.name}
                                            price={product.price}
                                            category={product.category}
                                            discount={product.discount}
                                            rating={product.rating}
                                            id={product._id}
                                        />
                                    ))
                                ) : (
                                    <div style={{ width: "100%", textAlign: "center", padding: "20px" }}>
                                        Không có sản phẩm nào thuộc danh mục này
                                    </div>
                                )}
                            </div>
                            {products?.data?.length > 0 && (
                                <Pagination
                                    current={page}
                                    pageSize={limit}
                                    total={products?.totalProduct || 0}
                                    onChange={onChangePage}
                                    style={{ textAlign: "center", marginTop: "20px" }}
                                />
                            )}
                        </Loading>
                    </WrapperProducts>
                </Row>
            </div>
        </div>
    );
};

export default TypeProducts;