import React, { useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import { Button } from 'antd'
import imageSingin from '../../assets/images/image-signin.webp'
import { Image } from 'antd'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';


const SignUp = () => {
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
                        <div style={{ marginBottom: "12px" }}>
                            <InputForm placeholder="Mật khẩu" />
                        </div>
                    </div>
                    <div style={{ position: "relative", width: "300px" }}>
                        <span style={{ zIndex: "10", position: "absolute", top: "4px", right: "8px" }}>
                            {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                        </span>
                        <InputForm placeholder="Nhập lại mật khẩu" />
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
                        Đăng Ký
                    </Button>
                    <p style={{ fontSize: "13px", color: "rgb(13,92,182)" }} >Quên mật khẩu?</p>
                    <div>
                        <span>Đã có tài khoản, </span>
                        <span style={{ fontSize: "13px", color: "rgb(13,92,182)" }}>Đăng nhập</span>
                    </div>
                </WrapperContainerLeft>

                <WrapperContainerRight>
                    <Image src={imageSingin} preview={false} alt="logo" height="260px" width="265px" />
                </WrapperContainerRight>
            </div >

        </div>
    )
}

export default SignUp