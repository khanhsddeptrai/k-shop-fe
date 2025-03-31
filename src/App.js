import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes/indexRoutes';
import DefaultComponent from './components/DefaultComponent/DefaultComponent';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from './redux/slices/userSlice';
import * as UserService from './services/UserService';

import '../src/assets/css/customToast.css'
import { isJsonString } from './untils';

function App() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

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
    const { decoded } = handleDecode();
    const currentTime = new Date().getTime() / 1000;
    if (decoded?.exp < currentTime) {
      try {
        const data = await UserService.refreshToken();
        const newAccessToken = data?.access_token;
        config.headers['token'] = `Bearer ${newAccessToken}`;
        localStorage.setItem('access_token', JSON.stringify(newAccessToken));
        dispatch(updateUser({ access_token: newAccessToken }));
      } catch (error) {
        localStorage.removeItem('access_token');
        toast.warning("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  const handleGetDetailUser = async (id, token) => {
    const res = await UserService.getDetailUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token }))
  }

  return (
    <div className='App'>
      <Router>
        <Routes>
          {
            routes.map((route, index) => {
              const isCheckAuth = !route.isPrivate
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