import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    id: '',
    name: '',
    email: '',
    phone: '',
    role: '',
    avatar: '',
    access_token: ''
}

export const userSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const { name = "", email = "", phone = "", role = "", avatar = "", access_token = "", _id = "" } = action.payload
            state.id = _id
            state.name = name || email
            state.email = email
            state.phone = phone
            state.role = role
            state.avatar = avatar
            state.access_token = access_token
        },
        resetUser: (state) => {
            state.name = ""
            state.email = ""
            state.phone = ""
            state.role = ""
            state.avatar = ""
            state.id = ""
            state.access_token = ""
        }
    },
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlice.actions

export default userSlice.reducer