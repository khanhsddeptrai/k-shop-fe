import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as ProductService from '../../services/ProductService';
import { WrapperProducts } from '../Home/style';
import CardComponent from '../../components/CardComponent/CardComponent';
import Loading from '../../components/Loading/Loading';
import { Pagination } from 'antd';

const SearchResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Lấy query params từ URL
    const getQueryParams = () => {
        const params = new URLSearchParams(location.search);
        return {
            query: params.get('query') || '',
            page: parseInt(params.get('page')) || 1,
            limit: parseInt(params.get('limit')) || 8,
        };
    };

    const [productsList, setProductsList] = useState([]);
    const [currentPage, setCurrentPage] = useState(getQueryParams().page);
    const [pageSize, setPageSize] = useState(getQueryParams().limit);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const { query } = getQueryParams();

    // Lấy danh sách sản phẩm
    const fetchSearchProducts = async (context) => {
        const limit = context?.queryKey[1];
        const search = context?.queryKey[2];
        const page = context?.queryKey[3];
        const res = await ProductService.getAllProduct({ limit, search, page });
        return res;
    };

    // Query cho sản phẩm
    const { isFetching: isFetchingProducts, data: products } = useQuery({
        queryKey: ['search-products', pageSize, query, currentPage],
        queryFn: fetchSearchProducts,
        retry: 3,
        retryDelay: 1000,
        keepPreviousData: true,
        enabled: !!query,
    });

    // Cập nhật danh sách sản phẩm và thông tin phân trang
    useEffect(() => {
        if (products?.data) {
            setProductsList(products.data);
            setTotalProducts(products.totalProduct || 0);
            setTotalPages(products.totalPage || 0);
            setCurrentPage(products.currentPage || currentPage);
        } else {
            setProductsList([]);
            setTotalProducts(0);
            setTotalPages(0);
        }
    }, [products]);

    // Đồng bộ state với query params khi URL thay đổi
    useEffect(() => {
        const { page, limit } = getQueryParams();
        setCurrentPage(page);
        setPageSize(limit);
    }, [location.search]);

    // Xử lý thay đổi phân trang
    const handleTableChange = (pagination) => {
        const { current, pageSize: newPageSize } = pagination;
        setCurrentPage(current);
        setPageSize(newPageSize);
        navigate(`?query=${query}&page=${current}&limit=${newPageSize}`);
    };

    return (
        <div style={{ padding: '0 210px', maxWidth: '1200px', }}>
            <h2 style={{ margin: '20px 0' }}>Kết quả tìm kiếm cho: "{query || 'Không có từ khóa'} "</h2>
            <div>
                <Loading isPending={isFetchingProducts}>
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
                            !isFetchingProducts && <div>Không tìm thấy sản phẩm nào</div>
                        )}
                    </WrapperProducts>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '0 auto', padding: "0 210px" }}>
                        {productsList.length >= 1 &&
                            <Pagination
                                current={currentPage}
                                total={totalProducts}
                                pageSize={pageSize}
                                onChange={(page, pageSize) =>
                                    handleTableChange({ current: page, pageSize })
                                }
                                showSizeChanger
                                pageSizeOptions={['2', '5', '8']}
                                showTotal={(total) => `Tổng ${total} sản phẩm`}
                                style={{ marginBottom: '20px' }}
                            />
                        }

                    </div>
                </Loading>
            </div>
        </div>
    );
};

export default SearchResultsPage;