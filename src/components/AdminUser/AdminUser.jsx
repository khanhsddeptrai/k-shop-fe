import React from 'react'
import { ButtonAddUser, WrapperHeader } from './style'
import { PlusSquareTwoTone } from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';

const AdminUser = () => {
    return (
        <>
            <WrapperHeader>Quản lí người dùng</WrapperHeader>
            <ButtonAddUser>
                <PlusSquareTwoTone style={{ fontSize: "50px" }} />
            </ButtonAddUser>
            <div style={{ marginTop: "10px" }}>
                <TableComponent />
            </div>
        </>
    )
}

export default AdminUser