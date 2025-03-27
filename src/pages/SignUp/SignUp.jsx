import React, { useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import { Button } from 'antd'
import imageSingin from '../../assets/images/image-signin.webp'
import { Image } from 'antd'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'

import * as UserService from '../../services/UserService';

import { useMutationHook } from '../../hooks/useMutationHook';
import Loading from '../../components/Loading/Loading';

const SignUp = () => {
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [isShowPasswordConfirm, setIsShowPasswordConfirm] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const naviagte = useNavigate();

    const mutation = useMutationHook(data => UserService.signupUser(data));
    const { data, isPending } = mutation;

    const handleNavigateSingIn = () => {
        naviagte('/sign-in')
    }

    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnchangePassword = (value) => {
        setPassword(value)
    }
    const handleOnchangeConfirmPassword = (value) => {
        setConfirmPassword(value)
    }

    const handleSignUp = () => {
        mutation.mutate({ email, password, confirmPassword })
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "rgba(0,0,0,0.53)" }}>
            <div style={{ width: "700px", height: "420px", borderRadius: "8px", background: "#fff", display: "flex", justifyContent: "space-between" }}>
                <WrapperContainerLeft>
                    <span style={{ fontSize: "24px", fontWeight: "500" }}>Xin chào</span>
                    <p>Đăng nhập và tạo tài khoản</p>
                    <div style={{ marginBottom: "12px" }}>
                        <InputForm placeholder="Email" type="email" handleOnchange={handleOnchangeEmail} />
                    </div>
                    <div style={{ position: "relative", width: "300px" }}>
                        <span
                            style={{ zIndex: "10", position: "absolute", top: "4px", right: "8px" }}
                            onClick={() => setIsShowPassword(!isShowPassword)}
                        >
                            {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                        </span>
                        <div style={{ marginBottom: "12px" }}>
                            <InputForm
                                placeholder="Mật khẩu"
                                type={isShowPassword ? "text" : "password"}
                                handleOnchange={handleOnchangePassword}
                            />
                        </div>
                    </div>
                    <div style={{ position: "relative", width: "300px" }}>
                        <span
                            style={{ zIndex: "10", position: "absolute", top: "4px", right: "8px" }}
                            onClick={() => setIsShowPasswordConfirm(!isShowPasswordConfirm)}
                        >
                            {isShowPasswordConfirm ? <EyeFilled /> : <EyeInvisibleFilled />}
                        </span>
                        <InputForm
                            placeholder="Nhập lại mật khẩu"
                            type={isShowPasswordConfirm ? "text" : "password"}
                            handleOnchange={handleOnchangeConfirmPassword}
                        />
                    </div>

                    {data?.status === 'ERR' ? <span style={{ color: "red" }}>{data?.message}</span>
                        : <span style={{ color: "green" }}>{data?.message}</span>
                    }
                    <Loading isPending={isPending}>
                        <Button
                            style={{
                                border: "none",
                                borderRadius: '4px',
                                background: !(email && password && confirmPassword) ? "rgba(255,57,69,0.6)" : "rgb(255,57,69)",
                                color: "#fff",
                                width: "100%",
                                height: "48px",
                                fontWeight: "700",
                                fontSize: "15px",
                                margin: "26px 0 10px"
                            }}
                            size='large'
                            onClick={handleSignUp}
                            disabled={!email && !password && !confirmPassword}
                        >
                            Đăng Ký
                        </Button>
                    </Loading>
                    <p style={{ fontSize: "13px", color: "rgb(13,92,182)" }} >Quên mật khẩu?</p>
                    <div>
                        <span>Đã có tài khoản, </span>
                        <span
                            style={{ fontSize: "13px", color: "rgb(13,92,182)", cursor: "pointer" }}
                            onClick={handleNavigateSingIn}
                        >Đăng nhập
                        </span>
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