import react from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from './pages/Home';
import NotFound from "./pages/NotFound";
import ProtectedRoute from './components/ProtectedRoute';
import UploadOutfit from './pages/UploadOutfit';
import OutfitRecommendations from './pages/OutfitRecommendations';

function Logout() {
  localStorage.clear()
  return <Navigate to= "/login" />
}

function RegisterAndLogout(){
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute> <Home /></ProtectedRoute>} />
        <Route path="/login" element={<Login />}/>
        <Route path="/logout" element={<Logout />}/>
        <Route path="/register" element={<RegisterAndLogout />}/>
        <Route path="/upload" element={<ProtectedRoute><UploadOutfit /></ProtectedRoute>} />
        <Route path="/outfits/:outfitId/recommendations" element={<ProtectedRoute><OutfitRecommendations /></ProtectedRoute>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
