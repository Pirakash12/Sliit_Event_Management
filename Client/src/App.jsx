import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home     from './pages/Home';
import Login     from './pages/Login';
import Register  from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Feedback from './pages/FeedbackPage';

// Simple protected route
const Protected = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/admindashboard" element={
            <Protected>
              <AdminDashboard />
            </Protected>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}