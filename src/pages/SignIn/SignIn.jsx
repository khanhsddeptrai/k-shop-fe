import React, { useEffect, useState, useRef } from 'react';
import { WrapperContainerLeft, WrapperContainerRight } from './style';
import InputForm from '../../components/InputForm/InputForm';
import { Button, Image } from 'antd';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import imageSingin from '../../assets/images/image-signin.webp';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as UserService from '../../services/UserService';
import { jwtDecode } from 'jwt-decode';
import { useMutationHook } from '../../hooks/useMutationHook';
import Loading from '../../components/Loading/Loading';
import { useDispatch } from 'react-redux';
import { updateUserRedux } from '../../redux/slices/userSlice';

const SignIn = () => {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Tạo ref cho các ô input
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const mutation = useMutationHook(data => UserService.loginUser(data));
    const { data, isPending } = mutation;

    useEffect(() => {
        if (data?.status === 'success') {
            toast.success(data.message);
            localStorage.setItem('access_token', JSON.stringify(data?.access_token));
            if (data?.access_token) {
                const decoded = jwtDecode(data?.access_token);
                if (decoded?.id) {
                    handleGetDetailUser(decoded?.id, data?.access_token);
                }
            }
            navigate('/');
        } else if (data?.status === 'ERR') {
            toast.error(data.message);
        }
    }, [data]);

    const handleGetDetailUser = async (id, token) => {
        const res = await UserService.getDetailUser(id, token);
        dispatch(updateUserRedux({ ...res?.data, access_token: token }));
    };

    const handleNavigateSignUp = () => {
        navigate('/sign-up');
    };

    const handleOnchangeEmail = (value) => {
        setEmail(value);
    };

    const handleOnchangePassword = (value) => {
        setPassword(value);
    };

    const handleSignIn = () => {
        mutation.mutate({ email, password });
    };

    // Xử lý khi nhấn Enter
    const handleKeyDown = (e, nextRef) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Ngăn hành vi mặc định của form
            if (nextRef) {
                // Chuyển focus sang ô tiếp theo
                nextRef.current.focus();
            } else {
                // Nếu không có ô tiếp theo (ô cuối), gọi hàm đăng nhập
                handleSignIn();
            }
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'rgba(0,0,0,0.53)' }}>
            <div style={{ width: '700px', height: '400px', borderRadius: '8px', background: '#fff', display: 'flex', justifyContent: 'space-between' }}>
                <WrapperContainerLeft>
                    <span style={{ fontSize: '24px', fontWeight: '500' }}>Xin chào</span>
                    <p>Đăng nhập và tạo tài khoản</p>
                    <div style={{ marginBottom: '12px' }}>
                        <InputForm
                            placeholder="Email"
                            type="email"
                            handleOnchange={handleOnchangeEmail}
                            inputRef={emailRef} // Gán ref cho ô email
                            onKeyDown={(e) => handleKeyDown(e, passwordRef)} // Xử lý Enter
                        />
                    </div>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <span
                            style={{ zIndex: '10', position: 'absolute', top: '4px', right: '8px' }}
                            onClick={() => setIsShowPassword(!isShowPassword)}
                        >
                            {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                        </span>
                        <InputForm
                            placeholder="Mật khẩu"
                            type={isShowPassword ? 'text' : 'password'}
                            handleOnchange={handleOnchangePassword}
                            inputRef={passwordRef} // Gán ref cho ô password
                            onKeyDown={(e) => handleKeyDown(e, null)} // Xử lý Enter (null vì không có ô tiếp theo)
                        />
                    </div>
                    <Loading isPending={isPending}>
                        <Button
                            style={{
                                border: 'none',
                                borderRadius: '4px',
                                background: !(email && password) ? 'rgba(255,57,69,0.6)' : 'rgb(255,57,69)',
                                color: '#fff',
                                width: '100%',
                                height: '48px',
                                fontWeight: '700',
                                fontSize: '15px',
                                margin: '26px 0 10px',
                            }}
                            size="large"
                            onClick={handleSignIn}
                            disabled={!(email && password)}
                        >
                            Đăng nhập
                        </Button>
                    </Loading>
                    <p style={{ fontSize: '13px', color: 'rgb(13,92,182)', cursor: 'pointer' }}>Quên mật khẩu?</p>
                    <div>
                        <span>Chưa có tài khoản, </span>
                        <span
                            style={{ fontSize: '13px', color: 'rgb(13,92,182)', cursor: 'pointer' }}
                            onClick={handleNavigateSignUp}
                        >
                            Tạo tài khoản
                        </span>
                    </div>
                </WrapperContainerLeft>
                <WrapperContainerRight>
                    <Image src={imageSingin} preview={false} alt="logo" height="260px" width="265px" />
                </WrapperContainerRight>
            </div>
        </div>
    );
};

export default SignIn;