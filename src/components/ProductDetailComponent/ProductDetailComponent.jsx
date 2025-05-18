import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Image, Row, InputNumber } from "antd";
import {
    WrapperAddressDeliver,
    WrapperInputNumberQuantity,
    WrapperPlusMinusButton,
    WrapperPriceProduct,
    WrapperPriceTextProduct,
    WrapperQuantityProduct,
    WrapperStyleColImage,
    WrapperStyleNameProduct,
    WrapperStyleTextSell,
    WrapperProducts
} from "./style";
import { StarFilled, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { getDetailProduct, getSimilarProducts } from "../../services/ProductService";
import { useMutationHook } from "../../hooks/useMutationHook";
import Loading from "../../components/Loading/Loading";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import CardComponent from "../../components/CardComponent/CardComponent";

const ProductDetailComponent = ({ productId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [stateProduct, setStateProduct] = useState({
        name: "",
        image: "",
        images: [],
        price: 0,
        rating: 0,
        sold: 0,
        countInStock: 0,
        deliveryAddress: "",
        category: "",
        description: "",
    });
    const [quantity, setQuantity] = useState(1);
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false); // State for description toggle
    const user = useSelector((state) => state.user);

    // Mutation cho chi tiết sản phẩm
    const mutation = useMutationHook((data) => getDetailProduct(data.id));
    const { data, isPending, isError, error } = mutation;

    // Mutation cho sản phẩm tương đồng
    const mutationRecommended = useMutationHook((data) =>
        getSimilarProducts({
            productId: data.productId,
            limit: data.limit,
        })
    );
    const { data: recommendedData, isPending: isPendingRecommended, isError: isErrorRecommended } = mutationRecommended;

    // Fetch chi tiết sản phẩm
    useEffect(() => {
        if (productId) {
            console.log("Fetching product with ID:", productId);
            mutation.mutate({ id: productId });
        }
    }, [productId]);

    // Xử lý dữ liệu chi tiết sản phẩm và gọi API sản phẩm tương đồng
    useEffect(() => {
        console.log("Mutation data:", data);
        if (data?.status === "Thành công") {
            const productData = data.data;
            if (productData) {
                setStateProduct({
                    name: productData.name || "",
                    image: productData.image || "default-image.jpg",
                    images: productData.images || [],
                    price: productData.price || 0,
                    rating: productData.rating || 0,
                    sold: productData.sold || 0,
                    countInStock: productData.countInStock || 0,
                    deliveryAddress: productData.deliveryAddress || "Địa chỉ mặc định",
                    category: productData.category?._id || productData.category || "",
                    description: productData.description || "Không có mô tả",
                });
                // Gọi API sản phẩm tương đồng
                mutationRecommended.mutate({
                    productId: productId,
                });
            } else {
                toast.error("Dữ liệu sản phẩm không hợp lệ");
            }
        } else if (data?.status === "Lỗi") {
            toast.error(data.message);
        }
    }, [data]);

    // Xử lý dữ liệu sản phẩm tương đồng
    useEffect(() => {
        console.log("Recommended data:", recommendedData);
        if (recommendedData?.status === "success") {
            setRecommendedProducts(recommendedData.data || []);
        } else if (recommendedData?.status === "ERR") {
            toast.error(recommendedData.message);
        }
    }, [recommendedData]);

    // Xử lý lỗi mutation
    useEffect(() => {
        if (isError) {
            console.error("Mutation error:", error);
            toast.error(error?.message || "Lỗi khi tải dữ liệu sản phẩm");
        }
        if (isErrorRecommended) {
            console.error("Recommended mutation error:", recommendedData?.message);
            toast.error("Lỗi khi tải sản phẩm tương đồng");
        }
    }, [isError, error, isErrorRecommended]);

    // Handle quantity change
    const onChangeQuantity = (value) => {
        if (stateProduct.countInStock === 0) {
            setQuantity(0);
            return;
        }
        if (value > 0 && value <= stateProduct.countInStock) {
            setQuantity(value);
        }
    };

    const handleIncrease = () => {
        if (stateProduct.countInStock === 0) return;
        if (quantity < stateProduct.countInStock) {
            setQuantity(quantity + 1);
        }
    };

    const handleDecrease = () => {
        if (stateProduct.countInStock === 0) return;
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    // Handle add to cart
    const handleAddToCart = () => {
        if (stateProduct.countInStock === 0) {
            toast.error("Sản phẩm đã hết hàng, không thể thêm vào giỏ hàng!");
            return;
        }
        const cartItem = {
            id: productId,
            name: stateProduct.name,
            price: stateProduct.price,
            image: stateProduct.image,
            quantity: quantity,
        };
        dispatch(addToCart(cartItem));
        toast.success(`Đã thêm ${stateProduct.name} vào giỏ hàng!`);
    };

    // Handle buy now
    const handleBuyNow = () => {
        if (stateProduct.countInStock === 0) {
            toast.error("Sản phẩm đã hết hàng, không thể mua ngay!");
            return;
        }
        const cartItem = {
            id: productId,
            name: stateProduct.name,
            price: stateProduct.price,
            image: stateProduct.image,
            quantity: quantity,
        };
        navigate("/checkout", {
            state: {
                selectedItems: [cartItem],
            },
        });
    };

    // Handle description toggle
    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    // Truncate description to ~100 characters
    const truncateDescription = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    return (
        <Loading isPending={isPending}>
            {isError ? (
                <div>Lỗi: Không thể tải dữ liệu sản phẩm</div>
            ) : (
                <div style={{ padding: "20px", background: "rgb(239, 239, 239)" }}>
                    {/* Phần chi tiết sản phẩm */}
                    <Row style={{ padding: "16px", background: "#fff", borderRadius: "4px" }}>
                        <Col span={10} style={{ borderRight: "1px solid #e5e5e5", paddingRight: "10px" }}>
                            <Image src={stateProduct.image} alt={stateProduct.name} preview={false} />
                            <Row style={{ paddingTop: "10px" }}>
                                {stateProduct.images.length > 0 ? (
                                    stateProduct.images.map((img, index) => (
                                        <WrapperStyleColImage span={4} key={index}>
                                            <Image src={img} alt={`product-img-${index}`} preview={false} style={{ width: "65px" }} />
                                        </WrapperStyleColImage>
                                    ))
                                ) : (
                                    <div>Không có hình ảnh phụ</div>
                                )}
                            </Row>
                        </Col>
                        <Col span={14} style={{ paddingLeft: "10px" }}>
                            <WrapperStyleNameProduct>{stateProduct.name || "Không có tên"}</WrapperStyleNameProduct>
                            <div>
                                {stateProduct.rating > 0 ? (
                                    Array(Math.round(stateProduct.rating))
                                        .fill()
                                        .map((_, i) => (
                                            <StarFilled key={i} style={{ fontSize: "12px", color: "rgb(253,216,54)" }} />
                                        ))
                                ) : (
                                    <span>Chưa có đánh giá</span>
                                )}
                                <WrapperStyleTextSell>| Đã bán {stateProduct.sold}+</WrapperStyleTextSell>
                            </div>
                            <WrapperPriceProduct>
                                <WrapperPriceTextProduct>
                                    {stateProduct.price.toLocaleString("vi-VN")}đ
                                </WrapperPriceTextProduct>
                            </WrapperPriceProduct>
                            <WrapperAddressDeliver>
                                <span>Giao đến</span>
                                <span className="address">{stateProduct.deliveryAddress}</span>
                                <span className="change-address">- Đổi địa chỉ</span>
                            </WrapperAddressDeliver>
                            <div
                                style={{
                                    margin: "10px 0 20px",
                                    borderTop: "1px solid #e5e5e5",
                                    borderBottom: "1px solid #e5e5e5",
                                    padding: "10px 0",
                                }}
                            >
                                <div style={{ marginBottom: "6px" }}>Số lượng </div>
                                <WrapperQuantityProduct>
                                    <WrapperPlusMinusButton
                                        size="small"
                                        icon={<MinusOutlined />}
                                        onClick={handleDecrease}
                                        disabled={quantity <= 1 || stateProduct.countInStock === 0}
                                    />
                                    <WrapperInputNumberQuantity
                                        size="small"
                                        value={stateProduct.countInStock === 0 ? 0 : quantity}
                                        onChange={onChangeQuantity}
                                        min={0}
                                        max={stateProduct.countInStock}
                                        autoFocus={false}
                                        disabled={stateProduct.countInStock === 0}
                                    />
                                    <WrapperPlusMinusButton
                                        size="small"
                                        icon={<PlusOutlined />}
                                        onClick={handleIncrease}
                                        disabled={quantity >= stateProduct.countInStock || stateProduct.countInStock === 0}
                                    />
                                </WrapperQuantityProduct>
                            </div>
                            <div style={{ display: "flex", gap: "12px", marginTop: "16px", alignItems: "center" }}>
                                <Button
                                    style={{
                                        border: "none",
                                        borderRadius: "4px",
                                        background: stateProduct.countInStock === 0 ? "#d9d9d9" : "rgb(255,57,69)",
                                        color: stateProduct.countInStock === 0 ? "#8c8c8c" : "#fff",
                                        width: "220px",
                                        height: "48px",
                                        fontWeight: "700",
                                        fontSize: "15px",
                                        cursor: stateProduct.countInStock === 0 ? "not-allowed" : "pointer",
                                    }}
                                    size="large"
                                    onClick={handleAddToCart}
                                    disabled={stateProduct.countInStock === 0}
                                >
                                    Thêm vào giỏ hàng
                                </Button>
                                <Button
                                    style={{
                                        border: "1px solid rgb(13, 92, 182)",
                                        borderRadius: "4px",
                                        background: stateProduct.countInStock === 0 ? "#d9d9d9" : "#fff",
                                        color: stateProduct.countInStock === 0 ? "#8c8c8c" : "rgb(13, 92, 182)",
                                        width: "220px",
                                        height: "48px",
                                        fontWeight: "700",
                                        fontSize: "15px",
                                        cursor: stateProduct.countInStock === 0 ? "not-allowed" : "pointer",
                                    }}
                                    size="large"
                                    onClick={handleBuyNow}
                                    disabled={stateProduct.countInStock === 0}
                                >
                                    Mua ngay
                                </Button>
                            </div>
                        </Col>
                    </Row>

                    {/* Phần mô tả sản phẩm */}
                    <div style={{ marginTop: "20px", background: "#fff", padding: "16px", borderRadius: "4px" }}>
                        <h3 style={{ marginBottom: "16px" }}>Mô tả sản phẩm</h3>
                        <div style={{ lineHeight: "1.6" }}>
                            {isExpanded || stateProduct.description.length <= 100
                                ? stateProduct.description
                                : truncateDescription(stateProduct.description, 100)}
                        </div>
                        {stateProduct.description.length > 100 && (
                            <Button
                                type="link"
                                onClick={toggleDescription}
                                style={{ padding: "0", marginTop: "8px" }}
                            >
                                {isExpanded ? "Thu gọn" : "Xem thêm"}
                            </Button>
                        )}
                    </div>

                    {/* Phần gợi ý sản phẩm */}
                    <div style={{ marginTop: "20px", background: "#fff", padding: "5px 16px", borderRadius: "4px" }}>
                        <h3 style={{ marginBottom: "16px" }}>Sản phẩm tương tự</h3>
                        <Loading isPending={isPendingRecommended}>
                            <WrapperProducts>
                                {recommendedProducts.length > 0 ? (
                                    recommendedProducts.map((product) => (
                                        <CardComponent
                                            key={product._id}
                                            id={product._id}
                                            name={product.name}
                                            image={product.image}
                                            price={product.price}
                                            countInStock={product.countInStock}
                                            category={stateProduct.category}
                                            discount={product.discount}
                                        />
                                    ))
                                ) : (
                                    <div>Không có sản phẩm tương đồng</div>
                                )}
                            </WrapperProducts>
                        </Loading>
                    </div>
                </div>
            )}
        </Loading>
    );
};

export default ProductDetailComponent;