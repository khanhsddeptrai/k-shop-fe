import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes/indexRoutes';
import DefaultComponent from './components/DefaultComponent/DefaultComponent';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

function App() {

  useEffect(() => {
    fetchApi()
  }, [])
  const fetchApi = async () => {
    const res = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/product/getAll`)
    return res.data
  }
  const query = useQuery({ queryKey: ['todos'], queryFn: fetchApi })
  console.log(query)
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
    </div>
  )
}

export default App