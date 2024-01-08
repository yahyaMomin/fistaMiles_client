import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Home from './pages/Home'
import Profile from './pages/Profile'
import UpdateProfile from './pages/UpdateProfile'
import PageNotFound from './pages/PageNotFound'
import Form from './pages/Form'
import ContentWrapper from './wrappers/ContentWrapper'

import './app.css'

import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const token = useSelector((state) => state.auth.token)
  return (
    <BrowserRouter>
      <ContentWrapper>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Routes>
          <Route path="/" element={!token ? <Form /> : <Navigate to="/home" />} />
          <Route path="/home" element={token ? <Home /> : <Navigate to="/" />} />
          <Route path="/profile/:id" element={token ? <Profile /> : <Navigate to="/" />} />
          <Route path="/updateProfile" element={token ? <UpdateProfile /> : <Navigate to="/" />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </ContentWrapper>
    </BrowserRouter>
  )
}
export default App
