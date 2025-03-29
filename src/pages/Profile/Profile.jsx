import React, { useEffect, useState } from 'react'
import {
    WrapperButtonUpdate,
    WrapperContainerContent,
    WrapperInput, WrapperLabel,
    WrapperProfileContent,
    WrapperProfileHeader,
    WrapperUploadAvatar
} from './style'
import InputForm from '../../components/InputForm/InputForm'
import { useSelector } from 'react-redux'
import * as UserService from '../../services/UserService';
import { useMutationHook } from '../../hooks/useMutationHook';
import Loading from '../../components/Loading/Loading';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slices/userSlice';
import { Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getBase64 } from '../../untils';

const Profile = () => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [avatar, setAvatar] = useState("")
    const [role, setRole] = useState([])
    // const [roles, setRoles] = useState([])
    // const [selectedRole, setSelectedRole] = useState("");

    const mutation = useMutationHook(dataUser => {
        const { id, access_token, ...rests } = dataUser
        return UserService.updateUser(id, rests, access_token)
    })
    // console.log("mutation update user: ", mutation)
    const { data, isPending } = mutation;

    useEffect(() => {
        if (data?.status === "success") {
            dispatch(updateUser({ ...data.data, access_token: user.access_token }));
            toast.success(data.message)
        } else if (data?.status === "ERR") {
            toast.error(data.message)
        }
    }, [data])

    useEffect(() => {
        setEmail(user?.email)
        setName(user?.name)
        setPhone(user?.phone)
        setAvatar(user?.avatar)
        setRole(user?.role)
        // setSelectedRole(user?.role);
    }, [user])

    // useEffect(() => {
    //     handleGetAllRole()
    // }, [])

    // const handleGetAllRole = async () => {
    //     try {
    //         const response = await UserService.getAllRole();
    //         if (response?.status === "success") {
    //             setRoles(response.data.map(role => role.name));
    //         } else {
    //             toast.error("Không thể lấy danh sách role");
    //         }
    //     } catch (error) {
    //         console.error("Error fetching roles: ", error);
    //         toast.error("Đã xảy ra lỗi khi lấy danh sách role");
    //     }
    // };

    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnchangeName = (value) => {
        setName(value)
    }
    const handleOnchangePhone = (value) => {
        setPhone(value)
    }
    const handleOnchangeRole = (value) => {
        // setSelectedRole(value);
    }
    const handleOnchangeAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setAvatar(file.preview)
    }

    const handleUpdate = async () => {
        mutation.mutate({ id: user?.id, email, name, phone, avatar, role, access_token: user?.access_token })
    }

    return (
        <div style={{ width: "1270px", margin: "0 auto", height: "500px" }}>
            <WrapperProfileHeader>Thông tin người dùng</WrapperProfileHeader>
            <Loading isPending={isPending}>
                <WrapperContainerContent>
                    <WrapperProfileContent>
                        <WrapperInput>
                            <WrapperLabel htmlFor='email'>Email</WrapperLabel>
                            <InputForm id="email" value={email} handleOnchange={handleOnchangeEmail} />
                        </WrapperInput>
                    </WrapperProfileContent>

                    <WrapperProfileContent>
                        <WrapperInput>
                            <WrapperLabel htmlFor='name'>Tên</WrapperLabel>
                            <InputForm id="name" value={name} handleOnchange={handleOnchangeName} />
                        </WrapperInput>
                    </WrapperProfileContent>

                    <WrapperProfileContent>
                        <WrapperInput>
                            <WrapperLabel htmlFor='phone'>Điện thoại</WrapperLabel>
                            <InputForm id="phone" value={phone} handleOnchange={handleOnchangePhone} />
                        </WrapperInput>
                    </WrapperProfileContent>
                    <WrapperProfileContent>
                        <WrapperInput>
                            <WrapperLabel htmlFor='role'>Quyền</WrapperLabel>
                            <InputForm id="role" value={role.name} handleOnchange={handleOnchangeRole} />
                        </WrapperInput>
                    </WrapperProfileContent>
                    {/* <WrapperProfileContent>
                        <WrapperInput>
                            <WrapperLabel htmlFor='role'>Quyền</WrapperLabel>
                            <select
                                id="role"
                                value={selectedRole} // Giá trị hiện tại của role được chọn
                                onChange={handleOnchangeRole} // Gọi hàm khi thay đổi
                                style={{ padding: '8px', width: '200px' }}
                            >
                                {roles?.length > 0 ? (
                                    roles.map((role, index) => (
                                        <option key={index} value={role}>
                                            {role}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">Đang tải roles...</option>
                                )}
                            </select>
                        </WrapperInput>
                    </WrapperProfileContent> */}
                    <WrapperProfileContent>
                        <WrapperInput>
                            <WrapperLabel htmlFor='avatar'>Ảnh đại diện</WrapperLabel>
                            <WrapperUploadAvatar onChange={handleOnchangeAvatar} maxCount={1} showUploadList={false}>
                                <Button icon={<UploadOutlined />}></Button>
                            </WrapperUploadAvatar>
                            {avatar &&
                                <img src={avatar} alt="avatar"
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        borderRadius: "50%",
                                        objectFit: "cover"
                                    }}
                                />
                            }
                        </WrapperInput>
                    </WrapperProfileContent>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "10px 0" }}>
                        <WrapperButtonUpdate onClick={handleUpdate}>
                            Cập nhật
                        </WrapperButtonUpdate>
                    </div>
                </WrapperContainerContent>
            </Loading>
        </div>
    )
}

export default Profile