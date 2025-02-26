import React, { useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import { Button, Image } from 'antd'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import imageSingin from '../../assets/images/image-signin.webp'

const SignIn = () => {
    const [isShowPassword, setIsShowPassword] = useState(false)

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "rgba(0,0,0,0.53)" }}>
            <div style={{ width: "700px", height: "400px", borderRadius: "8px", background: "#fff", display: "flex", justifyContent: "space-between" }}>
                <WrapperContainerLeft>
                    <span style={{ fontSize: "24px", fontWeight: "500" }}>Xin chào</span>
                    <p>Đăng nhập và tạo tài khoản</p>
                    <div style={{ marginBottom: "12px" }}>
                        <InputForm placeholder="Email" />
                    </div>
                    <div style={{ position: "relative", width: "300px" }}>
                        <span style={{ zIndex: "10", position: "absolute", top: "4px", right: "8px" }}>
                            {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                        </span>
                        <InputForm placeholder="Mật khẩu" type={isShowPassword ? "text" : "password"} />
                    </div>

                    <Button
                        style={{
                            border: "none",
                            borderRadius: '4px',
                            background: "rgb(255,57,69)",
                            color: "#fff",
                            width: "100%",
                            height: "48px",
                            fontWeight: "700",
                            fontSize: "15px",
                            margin: "26px 0 10px"
                        }}
                        size='large'
                    >
                        Đăng nhập
                    </Button>
                    <p style={{ fontSize: "13px", color: "rgb(13,92,182)", cursor: "pointer" }} >Quên mật khẩu?</p>
                    <div>
                        <span>Chưa có tài khoản, </span>
                        <span style={{ fontSize: "13px", color: "rgb(13,92,182)", cursor: "pointer" }}>Tạo tài khoản </span>
                    </div>
                </WrapperContainerLeft>

                <WrapperContainerRight>
                    <Image src={imageSingin} preview={false} alt="logo" height="260px" width="265px" />
                </WrapperContainerRight>
            </div >
        </div >
    )
}

export default SignIn