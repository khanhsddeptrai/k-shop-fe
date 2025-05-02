import React, { useEffect, useState } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import { WrapperTypeProduct, WrapperLoadMoreButoon, WrapperProducts } from "./style";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import slider1 from "../../assets/images/slider1.jpg";
import slider2 from "../../assets/images/slider2.jpg";
import slider3 from "../../assets/images/slider3.jpg";
import CardComponent from "../../components/CardComponent/CardComponent";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../services/ProductService";
import * as CategoryService from "../../services/CategoryService";
import Loading from "../../components/Loading/Loading";

const Home = () => {
    const [limit, setLimit] = useState(10);
    const [productsList, setProductsList] = useState([]);
    const [categories, setCategories] = useState([]);

    // Lấy danh sách sản phẩm
    const fetchAllProduct = async (context) => {
        const limit = context?.queryKey && context?.queryKey[1];
        const res = await ProductService.getAllProduct({ limit });
        return res;
    };

    // Lấy danh sách danh mục
    const fetchAllCategory = async () => {
        const res = await CategoryService.getAllCategory();
        return res;
    };

    // Query cho sản phẩm
    const { isFetching: isFetchingProducts, data: products } = useQuery({
        queryKey: ["products", limit],
        queryFn: fetchAllProduct,
        retry: 3,
        retryDelay: 1000,
        keepPreviousData: true,
    });

    // Query cho danh mục
    const { isFetching: isFetchingCategories, data: categoryData } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchAllCategory,
        retry: 3,
        retryDelay: 1000,
        keepPreviousData: true,
    });

    // Cập nhật danh sách sản phẩm
    useEffect(() => {
        if (products?.data) {
            setProductsList(products.data);
        }
    }, [products]);

    // Cập nhật danh sách danh mục
    useEffect(() => {
        if (categoryData?.data) {
            setCategories(categoryData.data);
        }
    }, [categoryData]);

    return (
        <>
            <div style={{ display: "flex" }}>
                <WrapperTypeProduct>
                    {isFetchingCategories ? (
                        <Loading />
                    ) : categories.length > 0 ? (
                        categories.map((category) => (
                            <TypeProduct id={category._id} name={category.name} />
                        ))
                    ) : (
                        <div>Không có danh mục nào</div>
                    )}
                </WrapperTypeProduct>
            </div>
            <div id="container" style={{ maxWidth: "1000px", padding: "0  100px 15px 100px", margin: "0 auto" }}>
                <SliderComponent arrImage={[slider1, slider2, slider3]} />
                <WrapperProducts>
                    {productsList?.length > 0 ? (
                        productsList.map((product) => (
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
                        !isFetchingProducts && <div>Không có sản phẩm nào</div>
                    )}
                </WrapperProducts>
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    {isFetchingProducts && <Loading />}
                    {!isFetchingProducts && (
                        <WrapperLoadMoreButoon
                            color="primary"
                            variant="outlined"
                            disabled={productsList?.length >= products?.totalProduct}
                        >
                            <span onClick={() => setLimit((prev) => prev + 5)}>
                                Xem thêm
                            </span>
                        </WrapperLoadMoreButoon>
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;