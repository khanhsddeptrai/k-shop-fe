import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes/indexRoutes';
import DefaultComponent from './components/DefaultComponent/DefaultComponent';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { updateUser } from './redux/slices/userSlice';
import * as UserService from './services/UserService';

import '../src/assets/css/customToast.css'
import { isJsonString } from './untils';
import axios from 'axios';

function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    const { decoded, storageData } = handleDecode()
    if (decoded?.id) {
      handleGetDetailUser(decoded?.id, storageData)
    }
  }, [])

  const handleDecode = () => {
    let storageData = localStorage.getItem('access_token')
    let decoded = {}
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData)
      decoded = jwtDecode(storageData)
    }
    return { decoded, storageData }
  }

  UserService.axiosJWT.interceptors.request.use(async (config) => {
    const { decoded } = handleDecode()
    const currentTime = new Date().getTime() / 1000;
    if (decoded?.exp < currentTime) {
      const data = await UserService.refreshToken()
      console.log("data: ", data)
      config.headers['token'] = `Bearer ${data?.access_token}`

    }
    return config
  }, (error) => {
    return Promise.reject(error)
  }
  )

  const handleGetDetailUser = async (id, token) => {
    const res = await UserService.getDetailUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token }))
    console.log("check res", res)
  }

  return (
    <div className='App'>
      <Router>
        <Routes>
          {
            routes.map((route, index) => {
              const Layout = route.isShowHeader ? DefaultComponent : React.Fragment
              return (
                < Route
                  key={index}
                  path={route.path}
                  element={<Layout><route.page /></Layout>}
                />

              )
            })
          }
        </Routes>
      </Router>
      <ToastContainer
        position="top-center" // Vị trí giống Ant Design Message
        autoClose={3000} // Tự đóng sau 3 giây
        hideProgressBar={true} // Hiển thị thanh tiến trình
        newestOnTop={true} // Thông báo mới xuất hiện trên cùng
        closeOnClick // Đóng khi nhấp
        pauseOnHover // Tạm dừng khi di chuột qua
        closeButton={false}
      />
    </div>
  )
}

export default App