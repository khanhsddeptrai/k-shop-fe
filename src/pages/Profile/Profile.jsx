import React, { useEffect, useState } from 'react';
import {
    WrapperButtonUpdate,
    WrapperContainerContent,
    WrapperInput,
    WrapperLabel,
    WrapperProfileContent,
    WrapperProfileHeader,
    WrapperUploadAvatar
} from './style';
import InputForm from '../../components/InputForm/InputForm';
import { useSelector, useDispatch } from 'react-redux';
import * as UserService from '../../services/UserService';
import { useMutationHook } from '../../hooks/useMutationHook';
import Loading from '../../components/Loading/Loading';
import { toast } from 'react-toastify';
import { updateUser } from '../../redux/slices/userSlice';
import { Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getBase64 } from '../../untils';

const Profile = () => {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [avatar, setAvatar] = useState("");
    const [selectedRoleId, setSelectedRoleId] = useState("");
    const [roles, setRoles] = useState([]);

    const mutation = useMutationHook(dataUser => {
        const { id, access_token, ...rests } = dataUser;
        return UserService.updateUser(id, rests, access_token);
    });

    const { data, isPending } = mutation;

    useEffect(() => {
        if (data?.status === "success") {
            // Cập nhật Redux store với dữ liệu từ server
            const updatedUser = { ...data.data, access_token: user.access_token };
            dispatch(updateUser(updatedUser));
            // Cập nhật state selectedRoleId để UI phản ánh thay đổi
            setSelectedRoleId(data.data.role); // Giả sử data.data.role là ObjectId
            toast.success(data.message);
        } else if (data?.status === "ERR") {
            toast.error(data.message);
        }
    }, [data]);

    useEffect(() => {
        setEmail(user?.email || "");
        setName(user?.name || "");
        setPhone(user?.phone || "");
        setAvatar(user?.avatar || "");
        setSelectedRoleId(user?.role || ""); // Đồng bộ với role từ Redux
    }, [user]);

    useEffect(() => {
        handleGetAllRole();
    }, []);

    const handleGetAllRole = async () => {
        try {
            const response = await UserService.getAllRole();
            if (response?.status === "success") {
                setRoles(response.data); // [{ _id: "xxx", name: "admin" }, ...]
            } else {
                toast.error("Không thể lấy danh sách role");
            }
        } catch (error) {
            console.error("Error fetching roles: ", error);
            toast.error("Đã xảy ra lỗi khi lấy danh sách role");
        }
    };

    const handleOnchangeEmail = (value) => setEmail(value);
    const handleOnchangeName = (value) => setName(value);
    const handleOnchangePhone = (value) => setPhone(value);
    const handleOnchangeRole = (e) => setSelectedRoleId(e.target.value);
    const handleOnchangeAvatar = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setAvatar(file.preview);
    };

    const handleUpdate = () => {
        mutation.mutate({
            id: user?.id,
            email,
            name,
            phone,
            avatar,
            role: selectedRoleId,
            access_token: user?.access_token
        });
    };

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
                            <select
                                id="role"
                                value={selectedRoleId}
                                onChange={handleOnchangeRole}
                                style={{ padding: '8px', width: '200px' }}
                            >
                                {roles.length > 0 ? (
                                    roles.map((role) => (
                                        <option key={role._id} value={role._id} selected>
                                            {role.name}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">Đang tải roles...</option>
                                )}
                            </select>
                        </WrapperInput>
                    </WrapperProfileContent>

                    <WrapperProfileContent>
                        <WrapperInput>
                            <WrapperLabel htmlFor='avatar'>Ảnh đại diện</WrapperLabel>
                            <WrapperUploadAvatar onChange={handleOnchangeAvatar} maxCount={1} showUploadList={false}>
                                <Button icon={<UploadOutlined />}></Button>
                            </WrapperUploadAvatar>
                            {avatar && (
                                <img
                                    src={avatar}
                                    alt="avatar"
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        borderRadius: "50%",
                                        objectFit: "cover"
                                    }}
                                />
                            )}
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
    );
};

export default Profile;