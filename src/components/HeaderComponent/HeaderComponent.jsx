import React, { useEffect, useState } from 'react';
import { Badge, Col, Input, Popover } from 'antd';
import {
    WrapperContentPopover, WrapperHeader, WrapperHeaderAccount, WrapperTextHeader,
    SuggestionImage, SuggestionItem, SuggestionsWrapper
} from './style';
import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { ButtonInputSearch } from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { resetUser } from '../../redux/slices/userSlice';
import * as UserService from '../../services/UserService';
import * as ProductService from '../../services/ProductService';
import Loading from '../../components/Loading/Loading';
import { toast } from 'react-toastify';
import { searchProduct } from '../../redux/slices/productSlice';
import useDebounce from '../../hooks/useDebounceHook';

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
    const [isPending, setIsPending] = useState(false);
    const [userName, setUserName] = useState('');
    const [search, setSearch] = useState('');
    const [avatar, setAvatar] = useState('');
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const user = useSelector((state) => state.user);
    const cartItems = useSelector((state) => state.cart.cartItems);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const debouncedSearch = useDebounce(search, 500);
    useEffect(() => {
        const fetchSuggestions = async () => {
            const keyword = debouncedSearch.trim();

            if (keyword) {
                setIsSuggestionsLoading(true);
                try {
                    const res = await ProductService.searchProductSuggestions(keyword);
                    const data = res?.data || [];
                    setSuggestions(data);
                    setIsPopoverOpen(data.length > 0); // ✅ chỉ bật khi có dữ liệu
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                    setSuggestions([]);
                    setIsPopoverOpen(false);
                }
                setIsSuggestionsLoading(false);
            } else {
                setSuggestions([]);
                setIsPopoverOpen(false);
            }
        };

        fetchSuggestions();
    }, [debouncedSearch]);



    const handleNavigateLogin = () => {
        navigate('/sign-in');
    };

    const handleLogout = async () => {
        setIsPending(true);
        localStorage.removeItem('access_token');
        const res = await UserService.logOut();
        dispatch(resetUser());
        setIsPending(false);
        navigate('/sign-in');
        toast.success(res.message);
        setPopoverVisible(false);
    };

    useEffect(() => {
        setIsPending(true);
        setUserName(user?.name);
        setAvatar(user?.avatar);
        setIsPending(false);
    }, [user?.name, user?.avatar]);

    const handleNavigateProfile = () => {
        setPopoverVisible(false);
        navigate('/profile');
    };

    const handleNavigateAdminPage = () => {
        setPopoverVisible(false);
        navigate('/system/admin');
    };

    const handleNavigateMyOrder = () => {
        setPopoverVisible(false);
        navigate('/my-order');
    };

    const handleNavigateCart = () => {
        navigate('/cart');
    };

    const handleSearchChange = (e) => {
        console.log('Search input:', e.target.value);
        setSearch(e.target.value);
        // Không đóng Popover ở đây để tránh gợi ý biến mất
    };

    const handleSearch = () => {
        if (search.trim()) {
            dispatch(searchProduct(search));
            navigate(`/search?query=${encodeURIComponent(search)}`);
            setSearch('');
            setSuggestions([]);
            setIsPopoverOpen(false);
        } else {
            navigate('/');
        }
    };

    const handleSuggestionClick = (productId) => {
        console.log('Suggestion clicked:', productId);
        setSearch('');
        setSuggestions([]);
        setIsPopoverOpen(false);
        navigate(`/product-detail/${productId}`);
    };

    const suggestionContent = (
        <SuggestionsWrapper onMouseDown={(e) => e.preventDefault()}>
            {isSuggestionsLoading ? (
                <Loading isPending={isSuggestionsLoading} />
            ) : suggestions.length > 0 ? (
                suggestions.map((product) => (
                    <SuggestionItem
                        key={product._id}
                        onClick={() => handleSuggestionClick(product._id)}
                        style={{ fontWeight: "500" }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <SuggestionImage src={product.image} alt={product.name} />
                            <span >{product.name}</span>
                        </div>
                        <span style={{ color: "rgb(255, 57, 69)" }}>{(product.price).toLocaleString('vi-VN')}đ</span>
                    </SuggestionItem>
                ))
            ) : (
                <div style={{ padding: '10px' }}>Không tìm thấy sản phẩm</div>
            )}
        </SuggestionsWrapper>
    );

    const content = (
        <div>
            <WrapperContentPopover onClick={handleNavigateProfile}>Thông tin người dùng</WrapperContentPopover>
            {user?.role?.name === 'admin' && (
                <WrapperContentPopover onClick={handleNavigateAdminPage}>Quản trị hệ thống</WrapperContentPopover>
            )}
            <WrapperContentPopover onClick={handleNavigateMyOrder}>Đơn hàng của tôi</WrapperContentPopover>
            <WrapperContentPopover onClick={handleLogout}>Đăng xuất</WrapperContentPopover>
        </div>
    );

    return (
        <div>
            <WrapperHeader>
                <Col span={3}>
                    <WrapperTextHeader onClick={() => navigate('/')}>K-SHOP</WrapperTextHeader>
                </Col>
                {isHiddenSearch === false ? (
                    <Col span={13}>
                        <Popover
                            content={suggestionContent}
                            open={isPopoverOpen}
                            placement="bottomLeft"
                        >
                            <Input
                                size="large"
                                placeholder="Tìm sản phẩm"
                                textButton="Tìm kiếm"
                                value={search}
                                onChange={handleSearchChange}
                                onClick={() => setIsPopoverOpen(true)} // Chỉ mở Popover khi click vào ô tìm kiếm
                                onBlur={() => setIsPopoverOpen(false)} // Đóng Popover khi rời khỏi ô tìm kiếm
                                onSearch={handleSearch}
                                onPressEnter={handleSearch}
                            />
                        </Popover>

                    </Col>
                ) : (
                    <Col span={13}></Col>
                )}
                <Col span={8}>
                    <Loading isPending={isPending}>
                        <WrapperHeaderAccount>
                            {avatar ? (
                                <img
                                    src={avatar}
                                    style={{
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginLeft: '15px',
                                    }}
                                    alt="avatar"
                                />
                            ) : (
                                <UserOutlined style={{ fontSize: '30px', marginLeft: '15px' }} />
                            )}
                            {user?.access_token ? (
                                <Popover
                                    content={content}
                                    trigger="click"
                                    open={popoverVisible}
                                    onOpenChange={(newOpen) => setPopoverVisible(newOpen)}
                                >
                                    <div style={{ cursor: 'pointer' }}>{userName || user?.email}</div>
                                </Popover>
                            ) : (
                                <div style={{ marginRight: '10px' }}>
                                    <span
                                        style={{ cursor: 'pointer', display: 'block', width: '140px' }}
                                        onClick={handleNavigateLogin}
                                    >
                                        Đăng nhập/ Đăng ký
                                    </span>
                                    <div>
                                        <span style={{ cursor: 'pointer' }}>Tài khoản</span>
                                        <CaretDownOutlined />
                                    </div>
                                </div>
                            )}
                            {isHiddenCart === false && (
                                <WrapperHeaderAccount onClick={handleNavigateCart}>
                                    <Badge count={cartItemCount} size="small">
                                        <ShoppingCartOutlined
                                            style={{ fontSize: '30px', color: '#fff', cursor: 'pointer' }}
                                        />
                                    </Badge>
                                    <span style={{ cursor: 'pointer', display: 'block', width: '80px' }}>
                                        Giỏ hàng
                                    </span>
                                </WrapperHeaderAccount>
                            )}
                        </WrapperHeaderAccount>
                    </Loading>
                </Col>
            </WrapperHeader>
        </div>
    );
};

export default HeaderComponent;