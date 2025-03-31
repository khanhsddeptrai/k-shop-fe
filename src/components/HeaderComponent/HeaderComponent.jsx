import React, { useEffect, useState } from "react";
import { Badge, Col, Popover } from 'antd';
import { WrapperContentPopover, WrapperHeader, WrapperHeaderAccount, WrapperTextHeader } from "./style";
// import Search from "antd/es/transfer/search";
import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { ButtonInputSearch } from "../ButtonInputSearch/ButtonInputSearch";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { resetUser } from '../../redux/slices/userSlice';

import * as UserService from '../../services/UserService';
import Loading from "../../components/Loading/Loading";
import { toast } from "react-toastify";

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
    const [isPending, setIsPending] = useState(false)
    const [userName, setUserName] = useState("")
    const [avatar, setAvatar] = useState("")
    const [popoverVisible, setPopoverVisible] = useState(false);
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const handleNavigateLogin = () => {
        navigate('/sign-in')
    }

    const handleLogout = async () => {
        setIsPending(true)
        localStorage.removeItem("access_token");
        const res = await UserService.logOut()
        dispatch(resetUser())
        setIsPending(false)
        navigate("/sign-in")
        toast.success(res.message)
        setPopoverVisible(false);
    }

    useEffect(() => {
        setIsPending(true)
        setUserName(user?.name)
        setAvatar(user?.avatar)
        setIsPending(false)
    }, [user?.name, user?.avatar])

    const handleNavigateProfile = () => {
        setPopoverVisible(false);
        navigate('/profile');
    };

    const handleNavigateAdminPage = () => {
        setPopoverVisible(false);
        navigate('/system/admin');
    };

    const content = (
        <div>
            <WrapperContentPopover onClick={handleNavigateProfile}>Thông tin người dùng</WrapperContentPopover>
            {
                user?.role.name === "admin" &&
                <WrapperContentPopover onClick={handleNavigateAdminPage}>Quản trị hệ thống</WrapperContentPopover>
            }
            <WrapperContentPopover onClick={handleLogout}>Đăng xuất</WrapperContentPopover>
        </div>
    )

    return (
        <div>
            <WrapperHeader>
                <Col span={3}>
                    <WrapperTextHeader href="/">K-SHOP</WrapperTextHeader>
                </Col>
                {isHiddenSearch === false ?
                    <Col span={13} >
                        <ButtonInputSearch size="large" placeholder="Tìm sản phẩm" textButton="Tìm kiếm" />
                    </Col>
                    :
                    <Col span={13} >

                    </Col>
                }

                <Col span={8} >
                    <Loading isPending={isPending}>
                        <WrapperHeaderAccount>
                            {avatar ? <img src={avatar} style={{
                                width: "38px",
                                height: "38px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                marginLeft: "15px"
                            }} />
                                :
                                <UserOutlined style={{ fontSize: "30px", marginLeft: "15px" }} />
                            }

                            {user?.access_token ?
                                <>
                                    <Popover
                                        content={content}
                                        trigger={"click"}
                                        open={popoverVisible}
                                        onOpenChange={(newOpen) => setPopoverVisible(newOpen)}
                                    >
                                        <div style={{ cursor: "pointer" }}>{user?.name || user.email}</div>
                                    </Popover>
                                </>
                                :
                                <div style={{ marginRight: "10px" }}>
                                    <span
                                        style={{ cursor: "pointer", display: "block", width: "140px" }}
                                        onClick={handleNavigateLogin}
                                    >Đăng nhập/ Đăng ký
                                    </span>
                                    <div>
                                        <span
                                            style={{ cursor: "pointer" }}
                                        >
                                            Tài khoản
                                        </span>
                                        <CaretDownOutlined />
                                    </div>
                                </div>}
                            {isHiddenCart === false &&
                                <WrapperHeaderAccount >
                                    <Badge count={5} size="small">
                                        <ShoppingCartOutlined style={{ fontSize: "30px", color: "#fff" }} />
                                    </Badge>
                                    <span
                                        style={{ cursor: "pointer", display: "block", width: "80px" }}
                                    >Giỏ hàng
                                    </span>
                                </WrapperHeaderAccount>
                            }


                        </WrapperHeaderAccount>
                    </Loading>
                </Col>
            </WrapperHeader>
        </div>
    )
}
export default HeaderComponent;