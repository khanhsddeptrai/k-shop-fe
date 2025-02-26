import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes } from './routes/indexRoutes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'

function App() {
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