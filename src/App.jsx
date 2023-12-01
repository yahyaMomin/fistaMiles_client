import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";
import PageNotFound from "./pages/PageNotFound";

import "./app.css";

import { useSelector } from "react-redux";
import ContentWrapper from "./components/ContentWrapper";

const App = () => {
  const token = useSelector((state) => state.auth.token);
  return (
    <BrowserRouter>
      <ContentWrapper>
        <Routes>
          <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={token ? <Navigate to="/" /> : <Register />} />
          <Route path="/profile/:id" element={token ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/updateProfile" element={token ? <UpdateProfile /> : <Navigate to="/login" />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </ContentWrapper>
    </BrowserRouter>
  );
};

export default App;